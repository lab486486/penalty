/** 매칭 키는 카테고리 slug 하나다. 글(이슈) slug로는 나누지 않는다. */

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const src = String(text ?? "").replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') {
      quoted = true;
      continue;
    }
    if (ch === ",") {
      row.push(cell);
      cell = "";
      continue;
    }
    if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      continue;
    }
    cell += ch;
  }
  if (cell.length || row.length) {
    row.push(cell);
    if (row.some((value) => value.trim())) rows.push(row);
  }
  return rows;
}

function table(text) {
  const [header, ...body] = parseCsv(text);
  if (!header) return [];
  const index = Object.fromEntries(header.map((name, i) => [name.trim(), i]));
  return body.map((cells) => (key) => (cells[index[key]] ?? "").trim());
}

function loadProducts(text) {
  const products = [];
  for (const get of table(text)) {
    const name = get("name");
    const href = get("url");
    const images = get("images").split("|").map((image) => image.trim()).filter(Boolean);
    const categories = get("categories").split("|").map((category) => category.trim()).filter(Boolean);
    if (!name || !href.startsWith("https://link.coupang.com/") || images.length === 0 || categories.length === 0) continue;
    products.push({ name, desc: get("desc"), images, href, categories });
  }
  return products;
}

function loadPopular(text) {
  const popular = [];
  for (const get of table(text)) {
    const category = get("category");
    if (!category || get("popular") !== "1" || popular.includes(category)) continue;
    popular.push(category);
  }
  return popular;
}

function toOffer(product) {
  return { name: product.name, desc: product.desc, images: product.images, href: product.href };
}

/**
 * 카테고리 키로 상품 하나를 고른다.
 * 맞는 행이 없으면 categories.csv 에서 popular=1 인 카테고리를 파일 순서대로 보고, 그 상품을 쓴다.
 * @param {string} productsText
 * @param {string} categoriesText
 * @param {string} category
 */
export function productFor(productsText, categoriesText, category) {
  const products = loadProducts(productsText);
  const direct = products.find((product) => product.categories.includes(category));
  if (direct) return toOffer(direct);
  for (const key of loadPopular(categoriesText)) {
    const hit = products.find((product) => product.categories.includes(key));
    if (hit) return toOffer(hit);
  }
  return undefined;
}
