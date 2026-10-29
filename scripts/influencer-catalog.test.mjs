import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("..", import.meta.url));

function walk(dir, found = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name === ".git") continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, found);
    else if (/\.(mjs|js|ts|astro|json|yml)$/.test(name) && !path.endsWith("influencer-catalog.test.mjs")) found.push(path);
  }
  return found;
}

test("상품 카드는 이름과 정적 링크로만 구성된다", () => {
  const csv = readFileSync(new URL("../data/influencer-products.csv", import.meta.url), "utf8");
  assert.match(csv, /스마트폰 연동 2채널 블랙박스/);
  assert.match(csv, /초소형 휴대용 카메라/);
  assert.match(csv, /https:\/\/link\.coupang\.com\/a\/gOIImn8phI/);
  assert.match(csv, /https:\/\/link\.coupang\.com\/a\/gOIImrO6Ee/);
  assert.equal(csv.includes("api-gateway.coupang.com"), false);
});

test("레포에 쿠팡 API 호출이 없다", () => {
  const files = walk(root);
  const hits = files.filter((path) => {
    const text = readFileSync(path, "utf8");
    return text.includes("api-gateway.coupang.com") || text.includes("ads-partners.coupang.com/g.js") || text.includes("products/search");
  });
  assert.deepEqual(hits, []);
});
