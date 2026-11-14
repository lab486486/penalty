import rss from "@astrojs/rss";
import { appFaqs } from "../data/app-faq";
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
    ...topics
      .filter((topic) => topic.slug !== "bounty")
      .map((topic) => ({
        title: getTopicSeo(topic.slug)?.title ?? topic.title,
        description: getTopicSeo(topic.slug)?.description ?? `${topic.title}. ${topic.penaltyNote}`,
        link: `/${topic.slug}/`,
      })),
    {
      title: "안전신문고",
      description: "안전신문고 앱 설치, 처리결과, 로그인, 신고 취하. 이용할 때 막히는 질문을 모아 두었습니다.",
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
