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
  /** 목록 화면에 두는 고유 설명. 링크 모음만 두지 않기 위한 문장입니다. */
  guide: string;
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
    guide:
      "불법주정차는 안전신문고 앱으로 접수합니다. 소화전, 교차로 모퉁이, 버스정류장, 횡단보도, 어린이보호구역은 과태료 범위가 다르고, 같은 장소라도 차종과 시간에 따라 금액이 갈립니다. 아래 유형에서 어디가 위반인지, 사진이 몇 장 필요한지, 어떤 경우는 접수가 안 되는지를 나눠 두었습니다.",
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
    guide:
      "신호위반, 끼어들기, 버스전용차로, 보도 위 이륜차는 주정차 신고와 창구가 다릅니다. 앞뒤 상황이 보이는 영상이 있어야 하고, 접수 뒤에는 경찰 검토를 거칩니다. 과태료로 확정되는 금액은 차종과 위반마다 다릅니다.",
  },
  {
    slug: "rewards",
    title: "신고 포상금 제도",
    short: "신고에 포상이 붙는지 항목별로 봅니다. 금액은 시·군청에서 확인합니다.",
    teaser: "포상 여부는 여기서, 금액은 시청에서",
    keywords: ["포상", "포상금", "신고 포상금", "신고 포상금 제도"],
    outcome: "maybe",
    fineLabel: "지역별 운영",
    guide:
      "포상금은 두 종류입니다. 간첩·은닉재산처럼 국가가 기준을 정한 제도와, 쓰레기·주정차처럼 시·군 조례로 금액과 신청 방법을 정하는 제도입니다. 조례 금액은 여기에 단정하지 않고, 해당 시청에서 확인하도록 안내합니다.",
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
    guide:
      "목줄, 배설물, 맹견 입마개는 동물보호법의 과태료입니다. 현장 사진과 장소가 있어야 하고, 개를 데리고 있던 사람을 확인해야 처분되는 경우가 많습니다. 맹견 범위와 목줄 기준은 유형별 글에 법령 기준으로 적어 두었습니다.",
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
    guide:
      "쓰레기 무단투기와 금연구역 흡연은 사진으로 접수할 수 있지만, 버리는 사람이나 피우는 사람이 보여야 과태료로 이어지는 경우가 많습니다. 포상금이 있는 지역도 금액과 신청은 시·군 조례라 시청 공고를 확인합니다.",
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
    guide:
      "주택을 허가 없이 숙박으로 영업하면 구청 단속 대상입니다. 주소와 광고 화면처럼 장소를 특정할 자료가 있어야 접수가 됩니다. 자세한 신고 조건은 불법숙박 안내로 이어집니다.",
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
    guide:
      "포트홀, 가로등, 난간은 과태료보다 보수 요청입니다. 위치와 사진을 안전신문고에 넣으면 관리 주체가 배정됩니다. 접수 순서는 도로 파손 안내에 적어 두었습니다.",
  },
];

/** 목록이 글 하나로 끝나는 분류는 그 글로 바로 갑니다. */
export function categoryPath(slug: string) {
  if (slug === "rewards") return "/rewards/";
  if (slug === "lodging") return "/illegal-lodging/";
  if (slug === "safety") return "/pothole/";
  return `/${slug}/`;
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function topicsIn(categorySlug: string) {
  return topics.filter((t) => t.category === categorySlug);
}
