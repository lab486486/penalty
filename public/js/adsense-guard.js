/* AdSense invalid-click gate. localStorage key: penalty-adsense-guard */
(function () {
  if (window.__penaltyAdsenseGuard) return;
  window.__penaltyAdsenseGuard = true;

  var KEY = "penalty-adsense-guard";
  var WINDOW_MS = 24 * 60 * 60 * 1000;
  var LIMIT = 3;
  var ARM_MS = 14000;
  var DEBOUNCE_MS = 700;

  var armUntil = 0;
  var lastCountAt = 0;
  var observer = null;

  function emptyState() {
    return { hits: [], blockedUntil: 0 };
  }

  function read() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!data || typeof data !== "object") return emptyState();
      var now = Date.now();
      var blockedUntil = typeof data.blockedUntil === "number" ? data.blockedUntil : 0;
      if (blockedUntil && now >= blockedUntil) {
        var reset = emptyState();
        write(reset);
        return reset;
      }
      var hits = Array.isArray(data.hits)
        ? data.hits.filter(function (t) {
            return typeof t === "number" && now - t < WINDOW_MS;
          })
        : [];
      return { hits: hits, blockedUntil: blockedUntil };
    } catch (e) {
      return emptyState();
    }
  }

  function write(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function isBlocked() {
    return read().blockedUntil > Date.now();
  }

  function isAdFrame(el) {
    if (!el || el.tagName !== "IFRAME") return false;
    var src = (el.getAttribute("src") || "") + " " + (el.getAttribute("data-src") || "");
    var label = (el.id || "") + " " + (el.getAttribute("name") || "");
    if (/googlesyndication|doubleclick/i.test(src)) return true;
    if (/aswift|google_ads_iframe/i.test(label)) return true;
    return false;
  }

  function isAdScript(el) {
    if (!el || el.tagName !== "SCRIPT") return false;
    var src = el.getAttribute("src") || "";
    return /adsbygoogle\.js|googlesyndication\.com\/pagead/i.test(src);
  }

  function isRemovable(el) {
    if (!el || el.nodeType !== 1 || !el.classList) return false;
    if (
      el.classList.contains("ad-unit") ||
      el.classList.contains("adsbygoogle") ||
      el.classList.contains("google-auto-placed")
    ) {
      return true;
    }
    return isAdFrame(el) || isAdScript(el);
  }

  function closestAd(node) {
    while (node && node !== document) {
      if (isRemovable(node)) return node;
      node = node.parentNode;
    }
    return null;
  }

  function scrubTree(node) {
    if (!node || node.nodeType !== 1) return;
    if (isRemovable(node)) {
      node.remove();
      return;
    }
    if (!node.querySelectorAll) return;
    var found = node.querySelectorAll(".ad-unit, .adsbygoogle, .google-auto-placed, iframe, script");
    for (var i = found.length - 1; i >= 0; i--) {
      if (isRemovable(found[i])) found[i].remove();
    }
  }

  function freezePush() {
    var queue = window.adsbygoogle;
    if (!Array.isArray(queue)) {
      queue = [];
      window.adsbygoogle = queue;
    }
    var noop = function () {
      return queue.length;
    };
    try {
      Object.defineProperty(queue, "push", {
        configurable: true,
        writable: true,
        value: noop,
      });
    } catch (e) {
      queue.push = noop;
    }
  }

  function startObserver() {
    if (observer || !window.MutationObserver) return;
    observer = new MutationObserver(function (mutations) {
      if (!isBlocked()) return;
      for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];
        if (mutation.type === "childList") {
          for (var j = 0; j < mutation.addedNodes.length; j++) scrubTree(mutation.addedNodes[j]);
        } else if (mutation.type === "attributes" && isRemovable(mutation.target)) {
          mutation.target.remove();
        }
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "class", "id", "name"],
    });
  }

  function engage() {
    freezePush();
    startObserver();
    scrubTree(document.documentElement);
  }

  function arm(event) {
    if (isBlocked()) return;
    if (!closestAd(event.target)) return;
    armUntil = Date.now() + ARM_MS;
  }

  function onLeave() {
    if (isBlocked()) return;
    var now = Date.now();
    if (now > armUntil) return;
    if (now - lastCountAt < DEBOUNCE_MS) return;
    lastCountAt = now;
    // Pointer can stay on the cross-origin iframe, which will not fire
    // mouseover again. Keep the arm through the next click.
    armUntil = now + ARM_MS;

    var state = read();
    state.hits.push(now);
    if (state.hits.length >= LIMIT) {
      state.hits = [];
      state.blockedUntil = now + WINDOW_MS;
      write(state);
      engage();
      return;
    }
    write(state);
  }

  // Moving outside an ad must not clear armUntil; only the sticky timer does.
  document.addEventListener("mouseover", arm, true);
  document.addEventListener("mousemove", arm, true);
  document.addEventListener("pointerover", arm, true);
  document.addEventListener("touchstart", arm, true);
  document.addEventListener("focusin", arm, true);
  document.addEventListener("focus", arm, true);
  window.addEventListener("blur", onLeave);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") onLeave();
  });
  window.addEventListener("pagehide", onLeave);
  window.addEventListener("pageshow", function () {
    if (isBlocked()) engage();
  });
  window.addEventListener("storage", function (event) {
    if (event.key === KEY && isBlocked()) engage();
  });

  if (isBlocked()) engage();
})();
