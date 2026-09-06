import fs from "node:fs/promises";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

function sitemapXmlAlias() {
  return {
    name: "sitemap-xml-alias",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const index = new URL("sitemap-index.xml", dir);
        try {
          await fs.copyFile(index, new URL("sitemap.xml", dir));
        } catch {
          // sitemap plugin output missing
        }
      },
    },
  };
}

export default defineConfig({
  site: "https://penalty.pe.kr",
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404"),
    }),
    sitemapXmlAlias(),
  ],
});
