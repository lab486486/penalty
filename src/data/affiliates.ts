import catalogCsv from "../../data/influencer-products.csv?raw";

export type AffiliateOffer = {
  name: string;
  desc: string;
  images: string[];
  href: string;
};

type ProductCard = AffiliateOffer & { categories: string[] };

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/^\uFEFF/, "");
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

function loadCards(text: string): ProductCard[] {
  const [header, ...body] = parseCsv(text);
  if (!header) return [];
  const index = Object.fromEntries(header.map((name, i) => [name.trim(), i]));
  const cards: ProductCard[] = [];
  for (const cells of body) {
    const get = (key: string) => (cells[index[key]] ?? "").trim();
    const name = get("name");
    const href = get("url");
    const images = get("images").split("|").map((image) => image.trim()).filter(Boolean);
    if (!name || !href.startsWith("https://link.coupang.com/") || images.length === 0) continue;
    cards.push({
      name,
      desc: get("desc"),
      images,
      href,
      categories: get("categories").split("|").map((category) => category.trim()).filter(Boolean),
    });
  }
  return cards;
}

const cards = loadCards(catalogCsv);

export function affiliateFor(category: string): AffiliateOffer | undefined {
  const card = cards.find((item) => item.categories.includes(category));
  if (!card) return undefined;
  return { name: card.name, desc: card.desc, images: card.images, href: card.href };
}
