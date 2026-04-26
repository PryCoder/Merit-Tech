function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

const meritScoreService = {
  // MVP scoring model:
  // - correctness is the main gate
  // - time + hints penalize
  // - returns score 0..100 with a breakdown
  computeScore({ passed, timeMs = null, hintsUsed = 0, testsPassed = null, testsTotal = null }) {
    const normalizedHints = Number.isFinite(hintsUsed) ? hintsUsed : 0;

    let base = passed ? 100 : 40;

    const minutes = timeMs && timeMs > 0 ? timeMs / 60_000 : 0;
    const timePenalty = clamp(Math.round(minutes * 2), 0, 30); // 2 points/min up to 30

    const hintPenalty = clamp(Math.round(normalizedHints * 5), 0, 30);

    let testBonus = 0;
    if (Number.isFinite(testsPassed) && Number.isFinite(testsTotal) && testsTotal > 0) {
      const ratio = clamp(testsPassed / testsTotal, 0, 1);
      testBonus = passed ? Math.round(ratio * 5) : Math.round(ratio * 3);
    }

    const score = clamp(base - timePenalty - hintPenalty + testBonus, 0, 100);

    return {
      score,
      breakdown: {
        base,
        timePenalty,
        hintPenalty,
        testBonus,
      },
    };
  },
};

module.exports = { meritScoreService };
