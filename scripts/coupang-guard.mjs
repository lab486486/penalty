/** 배치 수집이 쓸 상한. 공식 한도보다 낮고, 페이지·빌드·배포는 이 모듈을 부르지 않는다. */
export const LIMITS = {
  searchPerHour: 10,
  reportPerHour: 50,
  allPerMinute: 100,
  webLinkPerMinute: 50,
  hourlyCap: 6,
  minIntervalMs: 1500,
  windowMs: 60 * 60 * 1000,
};

export function emptyBudget(now = 0) {
  return { windowStart: now, calls: 0, lastCallAt: 0, stoppedUntil: 0 };
}

function fail(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

/** 한도 안이면 호출 1회를 예약한 새 예산을 돌려준다. 넘치면 throw. */
export function reserve(budget, now) {
  const hasWindow = Number.isFinite(budget?.windowStart);
  const start = hasWindow ? budget.windowStart : now;
  const expired = !hasWindow || now - start >= LIMITS.windowMs;
  const windowStart = expired ? now : start;
  const calls = expired ? 0 : Number(budget?.calls) || 0;
  const lastCallAt = expired ? 0 : Number(budget?.lastCallAt) || 0;
  const stoppedUntil = Number(budget?.stoppedUntil) || 0;
  if (stoppedUntil && now < stoppedUntil) throw fail("stopped");
  if (calls >= LIMITS.hourlyCap) throw fail("cap");
  if (calls > 0 && now - lastCallAt < LIMITS.minIntervalMs) throw fail("interval");
  if (LIMITS.hourlyCap >= LIMITS.searchPerHour) throw fail("cap-config");
  return { windowStart, calls: calls + 1, lastCallAt: now, stoppedUntil };
}
