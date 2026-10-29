import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { productFor } from "../src/data/catalog.mjs";
import { LIMITS, emptyBudget, reserve } from "./coupang-guard.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const products = readFileSync(new URL("../data/products.csv", import.meta.url), "utf8");
const categories = readFileSync(new URL("../data/categories.csv", import.meta.url), "utf8");

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
  assert.match(products, /스마트폰 연동 2채널 블랙박스/);
  assert.match(products, /초소형 휴대용 카메라/);
  assert.match(products, /https:\/\/link\.coupang\.com\/a\/gOIImn8phI/);
  assert.match(products, /https:\/\/link\.coupang\.com\/a\/gOIImrO6Ee/);
  assert.equal(products.includes("api-gateway.coupang.com"), false);
});

test("카테고리 키로 상품이 붙고, 없으면 인기 카테고리 순서로 붙는다", () => {
  const traffic = productFor(products, categories, "traffic");
  const parking = productFor(products, categories, "parking");
  const lodging = productFor(products, categories, "lodging");
  const safety = productFor(products, categories, "safety");
  assert.equal(traffic?.name, "스마트폰 연동 2채널 블랙박스");
  assert.equal(parking?.name, "초소형 휴대용 카메라");
  assert.equal(lodging?.href, parking?.href);
  assert.equal(safety?.href, parking?.href);
  assert.deepEqual(productFor(products, categories, "lodging"), lodging);
  assert.equal(productFor(products, "", "lodging"), undefined);
  assert.equal(productFor(products, "", "traffic")?.name, traffic?.name);
});

test("레포에 쿠팡 API 호출이 없다", () => {
  const files = walk(root);
  const hits = files.filter((path) => {
    const text = readFileSync(path, "utf8");
    return text.includes("api-gateway.coupang.com") || text.includes("ads-partners.coupang.com/g.js") || text.includes("products/search");
  });
  assert.deepEqual(hits, []);
  const pkg = readFileSync(new URL("../package.json", import.meta.url), "utf8");
  const deploy = readFileSync(new URL("../.github/workflows/deploy.yml", import.meta.url), "utf8");
  assert.equal(pkg.includes("coupang-batch"), false);
  assert.equal(deploy.includes("COUPANG_"), false);
  assert.equal(deploy.includes("coupang-batch"), false);
});

test("배치 한도는 공식 검색 한도보다 낮고 시간 창 밖에서 초기화된다", () => {
  assert.ok(LIMITS.hourlyCap < LIMITS.searchPerHour);
  assert.equal(LIMITS.searchPerHour, 10);
  assert.equal(LIMITS.reportPerHour, 50);
  assert.equal(LIMITS.allPerMinute, 100);
  assert.equal(LIMITS.webLinkPerMinute, 50);
  let budget = emptyBudget(0);
  for (let i = 0; i < LIMITS.hourlyCap; i++) {
    budget = reserve(budget, i * LIMITS.minIntervalMs);
  }
  assert.equal(budget.calls, LIMITS.hourlyCap);
  assert.throws(() => reserve(budget, LIMITS.hourlyCap * LIMITS.minIntervalMs), /cap/);
  assert.throws(() => reserve(reserve(emptyBudget(0), 0), 500), /interval/);
  assert.throws(() => reserve({ ...emptyBudget(0), stoppedUntil: 10_000 }, 1_000), /stopped/);
  const reset = reserve(budget, LIMITS.windowMs + LIMITS.minIntervalMs);
  assert.equal(reset.calls, 1);
});
