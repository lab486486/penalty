import { createHmac } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

const ACCESS_KEY = process.env.COUPANG_ACCESS_KEY ?? "";
const SECRET_KEY = process.env.COUPANG_SECRET_KEY ?? "";
const PATH = "/v2/providers/affiliate_open_api/apis/openapi/v1/deeplink";
const urls = {
  dashcam: "https://www.coupang.com/np/search?q=%EC%8A%A4%EB%A7%88%ED%8A%B8%ED%8F%B0%20%EC%97%B0%EB%8F%99%20%EB%B8%94%EB%9E%99%EB%B0%95%EC%8A%A4",
  minicam: "https://www.coupang.com/np/search?q=%EC%B4%88%EC%86%8C%ED%98%95%EC%B9%B4%EB%A9%94%EB%9D%BC",
};

function authorization(method, path) {
  const [pathname, query = ""] = path.split("?");
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const datetime = `${String(now.getUTCFullYear()).slice(2)}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
  const message = `${datetime}${method}${pathname}${query}`;
  const signature = createHmac("sha256", SECRET_KEY).update(message).digest("hex");
  return `CEA algorithm=HmacSHA256, access-key=${ACCESS_KEY}, signed-date=${datetime}, signature=${signature}`;
}

if (!ACCESS_KEY || !SECRET_KEY) {
  console.warn("쿠팡 키가 없어 기존 검색 링크를 유지합니다.");
  process.exit(0);
}

const res = await fetch(`https://api-gateway.coupang.com${PATH}`, {
  method: "POST",
  headers: {
    Authorization: authorization("POST", PATH),
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ coupangUrls: Object.values(urls) }),
});

const body = await res.json();
if (body.rCode !== "0" || !Array.isArray(body.data)) {
  console.error("쿠팡 딥링크 실패:", body);
  process.exit(1);
}

const next = { ...urls };
for (const row of body.data) {
  const original = String(row.originalUrl ?? "").trim();
  const short = String(row.shortenUrl ?? row.landingUrl ?? "").trim();
  if (original.includes("%EC%8A%A4%EB%A7%88%ED%8A%B8%ED%8F%B0") || original.includes("스마트폰")) {
    next.dashcam = short || next.dashcam;
  }
  if (original.includes("%EC%B4%88%EC%86%8C%ED%98%95") || original.includes("초소형")) {
    next.minicam = short || next.minicam;
  }
}

await writeFile(resolve("src/data/coupang-links.json"), `${JSON.stringify(next, null, 2)}\n`);
console.log("쿠팡 파트너스 링크를 갱신했습니다.");
