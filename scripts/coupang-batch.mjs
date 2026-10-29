/**
 * 배치 수집 입구. npm run build 와 배포 워크플로에서는 실행하지 않는다.
 * 기본 경로는 data/products.csv 이다. 이 파일은 HTTP 클라이언트를 두지 않는다.
 */
import { emptyBudget, reserve } from "./coupang-guard.mjs";

if (process.env.COUPANG_BATCH !== "1") {
  console.log("상품은 data/products.csv 입니다. 배치는 COUPANG_BATCH=1 일 때만 열리고, 지금은 요청 0회입니다.");
  process.exit(0);
}

reserve(emptyBudget(Date.now()), Date.now());
console.error("한도 안이어도 이 스크립트는 요청을 보내지 않습니다. data/products.csv 를 직접 고치세요.");
process.exit(1);
