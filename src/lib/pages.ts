import pagesJson from "../data/pages.json";

export type SitePage = {
  path: string;
  title: string;
  description: string;
  canonical: string;
  main: string;
};

export const pages = pagesJson as SitePage[];

export function pageByPath(path: string): SitePage {
  const page = pages.find((item) => item.path === path);
  if (!page) throw new Error(`Missing page: ${path}`);
  return page;
}

export function innerPages(): SitePage[] {
  return pages.filter((item) => item.path !== "/");
}
