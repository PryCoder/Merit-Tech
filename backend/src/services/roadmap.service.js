function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function scoreToBands(score) {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'strong';
  if (score >= 60) return 'developing';
  return 'needs-work';
}

const resourceDb = {
  fundamentals: [
    { kind: 'docs', title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/docs/Web/JavaScript/Guide' },
    { kind: 'practice', title: 'Big-O Cheat Sheet', url: 'https://www.bigocheatsheet.com/' },
  ],
  testing: [
    { kind: 'docs', title: 'Jest: Getting Started', url: 'https://jestjs.io/docs/getting-started' },
    { kind: 'docs', title: 'Testing Library: Introduction', url: 'https://testing-library.com/docs/' },
  ],
  cleanCode: [
    { kind: 'docs', title: 'Google JavaScript Style Guide', url: 'https://google.github.io/styleguide/jsguide.html' },
  ],
  dataStructures: [
    { kind: 'docs', title: 'MDN: Indexed collections (Array, TypedArray)', url: 'https://developer.mozilla.org/docs/Web/JavaScript/Guide/Indexed_collections' },
    { kind: 'docs', title: 'MDN: Keyed collections (Map, Set)', url: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map' },
  ],
  performance: [
    { kind: 'docs', title: 'Node.js Performance Best Practices', url: 'https://nodejs.org/en/learn/getting-started/nodejs-performance' },
  ],
};

const roadmapService = {
  // Deterministic MVP “Merit-Loop” engine.
  // Produces a skill-gap analysis + 7-day plan without external AI.
  buildRoadmap({ session, assessment }) {
    const score = session?.score?.score ?? null;
    const breakdown = session?.score?.breakdown ?? {};

    const timePenalty = Number.isFinite(breakdown.timePenalty)
      ? breakdown.timePenalty
      : 0;
    const hintPenalty = Number.isFinite(breakdown.hintPenalty)
      ? breakdown.hintPenalty
      : 0;

    const mistakes = session?.live?.memoryBank?.mistakes || {};
    const mistakeKeys = Object.keys(mistakes);

    const gaps = [];

    if (session?.submission?.passed === false) {
      gaps.push({ area: 'Correctness', severity: 'high', why: 'Solution did not pass (or not validated).' });
    }

    if (timePenalty >= 15) {
      gaps.push({ area: 'Efficiency', severity: 'medium', why: 'Time penalty suggests slow iteration or suboptimal approach.' });
    }

    if (hintPenalty >= 10) {
      gaps.push({ area: 'Problem Solving Fundamentals', severity: 'medium', why: 'High hint usage suggests missing mental models or patterns.' });
    }

    if (mistakeKeys.length >= 2) {
      gaps.push({ area: 'Debugging Discipline', severity: 'medium', why: 'Repeated run issues indicate missing feedback loop habits.' });
    }

    if (gaps.length === 0) {
      gaps.push({ area: 'Polish & Consistency', severity: 'low', why: 'Focus on code quality, tests, and communication.' });
    }

    const band = score === null ? 'developing' : scoreToBands(score);

    const focusTags = uniq(
      [
        hintPenalty >= 10 ? 'fundamentals' : null,
        timePenalty >= 15 ? 'performance' : null,
        mistakeKeys.length ? 'testing' : null,
        'cleanCode',
        'dataStructures',
      ].filter(Boolean)
    );

    const resources = focusTags.flatMap((t) => resourceDb[t] || []);

    const tasks = Array.isArray(assessment?.tasks) ? assessment.tasks : [];
    const taskTitle = tasks?.[0]?.title || 'Assessment Task';

    const plan = [
      {
        day: 1,
        title: 'Reproduce & simplify',
        items: [
          `Restate “${taskTitle}” in your own words.`,
          'List 5 edge cases and write expected outputs.',
          'Implement a brute-force solution and add a couple of tests.',
        ],
      },
      {
        day: 2,
        title: 'Complexity upgrade',
        items: [
          'Compute Big-O for your brute force.',
          'Identify the bottleneck and choose a data structure to fix it (Map/Set/heap/stack).',
          'Re-run with 2x larger inputs and note what changes.',
        ],
      },
      {
        day: 3,
        title: 'Testing & feedback loop',
        items: [
          'Write tests for boundary conditions and invalid inputs.',
          'Add one property-based-style test idea (even if you implement it manually).',
          'Practice debugging by forcing one bug and fixing it quickly.',
        ],
      },
      {
        day: 4,
        title: 'Clean code pass',
        items: [
          'Rename variables for clarity; extract helper functions.',
          'Remove duplication; add small comments only where necessary.',
          'Ensure consistent error handling and input validation.',
        ],
      },
      {
        day: 5,
        title: 'Performance habits',
        items: [
          'Add lightweight timing logs around hotspots.',
          'Validate there are no accidental O(n^2) loops.',
          'Practice one optimization refactor without changing behavior.',
        ],
      },
      {
        day: 6,
        title: 'Second attempt (no hints)',
        items: [
          'Solve a similar problem without asking for hints.',
          'After finishing, compare your approach to a known pattern.',
          'Write a short retrospective: what you’d do first next time.',
        ],
      },
      {
        day: 7,
        title: 'Mock interview run',
        items: [
          'Do a timed run (30–45 min).',
          'Explain tradeoffs out loud (or in notes) while coding.',
          'Review replay and spot any copy/paste or big jumps.',
        ],
      },
    ];

    return {
      band,
      skillGaps: gaps,
      focusTags,
      resources,
      plan,
      metrics: {
        score,
        timePenalty: clamp(timePenalty, 0, 100),
        hintPenalty: clamp(hintPenalty, 0, 100),
        hintsUsed: session?.submission?.hintsUsed ?? session?.live?.hintsUsed ?? 0,
        mistakeKeys: mistakeKeys.slice(0, 10),
      },
    };
  },
};

module.exports = { roadmapService };
