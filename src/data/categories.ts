import { topics } from "./topics";

export type Outcome = "fine" | "maybe" | "fix";

export type Category = {
  slug: string;
  title: string;
  short: string;
  teaser: string;
  keywords: string[];
  outcome: Outcome;
  fineLabel: string;
  cover?: string;
};

export const outcomes: Record<Outcome, { label: string; hint: string }> = {
  fine: {
    label: "과태료가 잘 붙음",
    hint: "사진만으로 처분이 되는 경우가 많습니다.",
  },
  maybe: {
    label: "확인이 필요함",
    hint: "사람·현장이 확인돼야 과태료가 붙습니다.",
  },
  fix: {
    label: "조치 요청",
    hint: "과태료보다 보수·점검이 먼저입니다.",
  },
};

export const categories: Category[] = [
  {
    slug: "parking",
    title: "불법주정차 신고",
    short: "역사는 승자를 기록하고, 과태료 영수증은 범죄를 기록한다.",
    teaser: "소화전, 횡단보도, 스쿨존, 장애인·소방·충전",
    keywords: ["주정차", "주차", "불법주차", "소화전", "횡단보도", "스쿨존"],
    outcome: "fine",
    fineLabel: "최대 200만 원",
    cover: "/cards/parking.jpg?v=2",
  },
  {
    slug: "traffic",
    title: "교통위반 신고",
    short: "인내심은 참는 것이 아니라 신고로 해소하는 것이다.",
    teaser: "신호위반, 끼어들기, 버스전용, 오토바이",
    keywords: ["교통", "신호위반", "끼어들기", "버스전용", "오토바이"],
    outcome: "fine",
    fineLabel: "최대 13만 원",
    cover: "/cards/traffic.jpg?v=4",
  },
  {
    slug: "rewards",
    title: "신고 포상금 제도",
    short: "과태료가 나와야 포상이 붙는 항목입니다.",
    teaser: "🚨 돈 벌어가세요!",
    keywords: ["포상", "포상금", "신고 포상금", "신고 포상금 제도"],
    outcome: "maybe",
    fineLabel: "지역별 운영",
  },
  {
    slug: "pets",
    title: "반려견 관련 신고",
    short: "세상에 나쁜 개는 없다. 이기적인 주인만 있을 뿐..",
    teaser: "목줄 미착용, 배설물 미처리",
    keywords: ["반려", "목줄", "배설물", "맹견", "입마개"],
    outcome: "maybe",
    fineLabel: "최대 50만 원",
    cover: "/cards/pets.jpg?v=3",
  },
  {
    slug: "living",
    title: "쓰레기, 담배꽁초 신고",
    short: "향기로운 사람은 머문자리도 아름답다.",
    teaser: "무단투기, 금연구역 흡연",
    keywords: ["쓰레기", "무단투기", "흡연", "금연", "담배꽁초"],
    outcome: "maybe",
    fineLabel: "최대 10만 원",
    cover: "/cards/living.jpg",
  },
  {
    slug: "lodging",
    title: "불법숙박 신고",
    short: "세금 피해서 모은 쌈짓돈, 신고 한번에 일시불 순삭",
    teaser: "무허가 게스트하우스, 주택 불법 영업",
    keywords: ["숙박", "게스트하우스", "에어비앤비"],
    outcome: "maybe",
    fineLabel: "과태료 부과",
    cover: "/cards/lodging.jpg?v=2",
  },
  {
    slug: "safety",
    title: "도로 파손 신고",
    short: "내가 무심코 넘긴 포트홀, 덫이 되어 돌아온다",
    teaser: "포트홀, 가로등, 난간",
    keywords: ["포트홀", "도로", "가로등", "파손"],
    outcome: "fix",
    fineLabel: "안전사고",
    cover: "/cards/safety.jpg",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function topicsIn(categorySlug: string) {
  return topics.filter((t) => t.category === categorySlug);
}
