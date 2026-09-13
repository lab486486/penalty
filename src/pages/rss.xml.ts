import rss from "@astrojs/rss";
import { appFaqs } from "../data/app-faq";
import { bountyItems } from "../data/bounty-items";
import { categories } from "../data/categories";
import { getTopicSeo } from "../data/seo";
import { topics } from "../data/topics";
import { site } from "../site.config";

export function GET() {
  const published = new Date();

  const items = [
    {
      title: site.title,
      description: site.description,
      link: "/",
    },
    ...categories.map((c) => ({
      title: c.title,
      description: `${c.short}. ${c.keywords.join(", ")}`,
      link: `/${c.slug}/`,
    })),
    ...topics
      .filter((t) => t.slug !== "bounty")
      .map((t) => ({
        title: getTopicSeo(t.slug)?.title ?? t.title,
        description: getTopicSeo(t.slug)?.description ?? `${t.title}. ${t.penaltyNote}`,
        link: `/${t.slug}/`,
      })),
    ...bountyItems.map((b) => ({
      title: b.seoTitle,
      description: b.seoDescription,
      link: `/rewards/${b.slug}/`,
    })),
    {
      title: "시·군청 바로가기",
      description: "전국 시청·군청 공식 홈페이지로 과태료·무단투기 포상 조례를 확인합니다.",
      link: "/offices/",
    },
    {
      title: "안전신문고 앱 설치",
      description: "안드로이드는 구글플레이, 아이폰은 앱스토어에서 안전신문고 앱을 받습니다.",
      link: "/app/",
    },
    {
      title: "안전신문고 자주하는 질문",
      description:
        "처리결과, 아이디 찾기, 신고 취하, 앱이 안 열릴 때. 안전신문고 이용 질문을 제목별로 모아 두었습니다.",
      link: "/faq/",
    },
    ...appFaqs.map((item) => ({
      title: item.title,
      description: item.description,
      link: `/faq/${item.slug}/`,
    })),
  ];

  return rss({
    title: site.title,
    description: site.description,
    site: site.baseUrl,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    customData: [
      "<language>ko</language>",
      `<atom:link href="${site.baseUrl}/rss.xml" rel="self" type="application/rss+xml" />`,
    ].join(""),
    items: items.map((item) => ({
      title: item.title,
      description: item.description,
      link: item.link,
      pubDate: published,
    })),
  });
}
