// Non-spoiler mentor hints.
// Uses Grok via LangChain when configured; falls back to deterministic hints.

const { logger } = require('../utils/logger');
const { createGrokMentor } = require('./grokMentor.chain');

function normalize(s) {
  return String(s || '').toLowerCase();
}

const deterministicMentor = {
  getHint({ prompt, attemptNumber = 1 }) {
    const p = normalize(prompt);

    const generic = [
      'Restate the problem in your own words and list edge cases first.',
      'Try to derive the simplest brute-force solution, then optimize it.',
      'Add a small example and trace your algorithm step-by-step.',
      'Think about time/space complexity and what data structure helps.',
    ];

    const buckets = [
      {
        match: ['array', 'two sum', 'pair', 'subarray'],
        hints: [
          'Consider using a hash map to track seen values.',
          'If order matters, a sliding window might help.',
        ],
      },
      {
        match: ['string', 'palindrome', 'substring'],
        hints: [
          'Watch out for off-by-one errors when slicing substrings.',
          'Two pointers can help for palindrome checks.',
        ],
      },
      {
        match: ['graph', 'node', 'edge', 'bfs', 'dfs'],
        hints: [
          'Try BFS for shortest path in unweighted graphs.',
          'Track visited nodes to avoid cycles.',
        ],
      },
      {
        match: ['dp', 'dynamic programming', 'memo'],
        hints: [
          'Define the state clearly: what do you need to know at each step?',
          'Write the recurrence and base cases before coding.',
        ],
      },
    ];

    const matched = buckets.find((b) => b.match.some((k) => p.includes(k)));
    const pool = matched ? matched.hints : generic;

    const idx = Math.max(0, (attemptNumber - 1) % pool.length);

    return {
      hint: pool[idx],
      style: 'non-spoiler',
    };
  },
};

let grokMentorPromise = null;

async function getGrokMentor(config) {
  if (!config?.grok?.enabled) return null;
  if (!grokMentorPromise) {
    grokMentorPromise = createGrokMentor({ grokConfig: config.grok });
  }
  return grokMentorPromise;
}

const mentorService = {
  async getHint({ prompt, attemptNumber = 1, config }) {
    try {
      const grokMentor = await getGrokMentor(config);
      if (grokMentor) {
        return await grokMentor.getHint({ prompt, attemptNumber });
      }
    } catch (err) {
      logger.warn(
        'Grok mentor unavailable; falling back to deterministic hints',
        {
          message: err?.message,
        }
      );
    }

    return deterministicMentor.getHint({ prompt, attemptNumber });
  },
};

module.exports = { mentorService };
