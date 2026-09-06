import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { pages } from "../lib/pages";

export function GET(context: APIContext) {
  const site = context.site ?? new URL("https://penalty.pe.kr/");
  return rss({
    title: "Penalty — 과태료·신고 가이드",
    description:
      "불법주정차, 교통위반, 반려견 목줄, 쓰레기·흡연까지. 과태료가 붙는 신고만 모아 공식 앱·사이트로 안내합니다. 접수 기관이 아닙니다.",
    site,
    items: pages.map((page) => ({
      title: page.title,
      description: page.description,
      link: page.path,
    })),
  });
}
