// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { site } from "./src/site.config.ts";

export default defineConfig({
  site: site.baseUrl,
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/bounty"),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const important = path === "/" || path === "/rewards/" || path === "/parking/" || path === "/faq/" || path === "/app/";
        const faqPage = path.startsWith("/faq/");
        item.lastmod = new Date().toISOString();
        item.changefreq = /** @type {typeof item.changefreq} */ (important ? "daily" : "weekly");
        item.priority = path === "/" ? 1 : important ? 0.8 : faqPage ? 0.7 : 0.6;
        return item;
      },
    }),
  ],
  redirects: {
    "/bounty": "/rewards/",
  },
  build: {
    inlineStylesheets: "always",
  },
});
