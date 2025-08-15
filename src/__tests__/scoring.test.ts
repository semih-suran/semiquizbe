import {
  computeScoreRaw,
  computeScoreRounded,
  TOTAL_TEST_TIME_MS,
} from '../common/scoring';

describe('scoring util', () => {
  it('returns 0 for zero correct answers', () => {
    const raw = computeScoreRaw(0, 0);
    const rounded = computeScoreRounded(0, 0);
    expect(raw).toBe(0);
    expect(rounded).toBe(0);
  });

  it('decreases as elapsed time increases', () => {
    const rawAt0 = computeScoreRaw(10, 0);
    const rawAtHalf = computeScoreRaw(10, Math.floor(TOTAL_TEST_TIME_MS / 2));
    expect(rawAt0).toBeGreaterThan(rawAtHalf);
  });

  it('rounding behavior known case', () => {
    // Construct a case where raw has .5 fraction
    const correctCount = 50;
    const elapsedMs = TOTAL_TEST_TIME_MS - 1; // (total-elapsed)+1 = 2
    // raw = (50*100 * 2) / 10000 = (5000*2)/10000 = 1.0 -> rounded 1
    const raw = computeScoreRaw(correctCount, elapsedMs);
    expect(raw).toBeGreaterThanOrEqual(0);
    const rounded = computeScoreRounded(correctCount, elapsedMs);
    expect(Number.isInteger(rounded)).toBe(true);
  });

  it('matches expected numeric example', () => {
    const correctCount = 10;
    const elapsedMs = 0;
    // raw = (10*100 * (600000 - 0 + 1)) / 10000
    const expectedRaw = (10 * 100 * (TOTAL_TEST_TIME_MS - 0 + 1)) / 10000;
    const raw = computeScoreRaw(correctCount, elapsedMs);
    expect(raw).toBeCloseTo(expectedRaw, 6);
    expect(computeScoreRounded(correctCount, elapsedMs)).toBe(
      Math.round(expectedRaw)
    );
  });
});
