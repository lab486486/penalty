// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { bountyItems } from "./src/data/bounty-items.ts";
import { offices } from "./src/data/offices.ts";
import { site } from "./src/site.config.ts";

const officeRedirects = Object.fromEntries(
  offices.map((office) => [`/offices/${office.slug}/`, "/illegal-parking/"]),
);

const rewardTargets = {
  "parking-reward": "/illegal-parking/",
  "dumping-reward": "/dumping/",
  cigarette: "/smoking/",
};

const rewardRedirects = Object.fromEntries(
  bountyItems.map((item) => [`/rewards/${item.slug}/`, rewardTargets[item.slug] ?? "/"]),
);

export default defineConfig({
  site: site.baseUrl,
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/bounty"),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const important = path === "/" || path === "/illegal-parking/" || path === "/faq/";
        const faqPage = path.startsWith("/faq/");
        item.lastmod = new Date().toISOString();
        item.changefreq = /** @type {typeof item.changefreq} */ (important ? "daily" : "weekly");
        item.priority = path === "/" ? 1 : important ? 0.8 : faqPage ? 0.7 : 0.6;
        return item;
      },
    }),
  ],
  redirects: {
    "/bounty": "/",
    "/lodging/": "/illegal-lodging/",
    "/safety/": "/pothole/",
    "/parking/": "/illegal-parking/",
    "/traffic/": "/red-light/",
    "/pets/": "/dog-leash/",
    "/living/": "/dumping/",
    "/rewards/": "/",
    "/app/": "/faq/",
    "/offices/": "/illegal-parking/",
    ...officeRedirects,
    ...rewardRedirects,
  },
  build: {
    inlineStylesheets: "always",
  },
});
