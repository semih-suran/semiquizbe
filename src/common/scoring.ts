export const TOTAL_TEST_TIME_MS = 600_000; // 10 minutes

export function computeScoreRaw(correctCount: number, elapsedMs: number, totalTestTimeMs = TOTAL_TEST_TIME_MS): number {
  const numerator = (correctCount * 100) * ((totalTestTimeMs - elapsedMs) + 1);
  const raw = numerator / 10000;
  return raw;
}

export function computeScoreRounded(correctCount: number, elapsedMs: number, totalTestTimeMs = TOTAL_TEST_TIME_MS): number {
  return Math.round(computeScoreRaw(correctCount, elapsedMs, totalTestTimeMs));
}
