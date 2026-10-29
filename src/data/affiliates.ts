import productsCsv from "../../data/products.csv?raw";
import { productFor } from "./catalog.mjs";

export type AffiliateOffer = {
  name: string;
  desc: string;
  images: string[];
  href: string;
};

const categoryFiles = import.meta.glob("../../data/categories.csv", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const categoriesCsv = Object.values(categoryFiles)[0] ?? "";

export function affiliateFor(category: string): AffiliateOffer | undefined {
  return productFor(productsCsv, categoriesCsv, category);
}
