import coupangSearch from "./coupang-links.json";

export type AffiliateOffer = {
  name: string;
  desc: string;
  images: string[];
  href: string;
};

export { coupangSearch };

const dashcam: AffiliateOffer = {
  name: "스마트폰 연동 2채널 블랙박스",
  desc: "자동 촬영한 블랙박스 영상을 스마트폰으로 간편히 옮기세요! 도로 위 무법자에 대한 신고를 편리하게 할 수 있습니다.",
  images: ["/preview/dashcam.png", "/preview/dashcam-2.png", "/preview/dashcam-3.png"],
  href: coupangSearch.dashcam,
};

const minicam: AffiliateOffer = {
  name: "초소형 휴대용 카메라",
  desc: "몰상식한 사람들이 의외로 눈치가 빠릅니다. 나에 대한 블랙박스이자 증거를 남길 수 있는 최적의 장비입니다.",
  images: ["/preview/minicam.png", "/preview/minicam-2.png", "/preview/minicam-3.png", "/preview/minicam-4.png"],
  href: coupangSearch.minicam,
};

export function affiliateFor(category: string): AffiliateOffer | undefined {
  if (category === "traffic") return dashcam;
  if (category === "parking" || category === "pets" || category === "living" || category === "rewards") {
    return minicam;
  }
  return undefined;
}
