const { logger } = require('../utils/logger');
const { createTaskCreator } = require('./taskCreator.chain');

let grokTaskCreatorPromise = null;

async function getGrokTaskCreator(config) {
  const llm = config?.groq || config?.grok;
  if (!llm?.enabled) return null;
  if (!grokTaskCreatorPromise) {
    grokTaskCreatorPromise = createTaskCreator({ grokConfig: llm });
  }
  return grokTaskCreatorPromise;
}

function deterministicDraft({ titleHint, difficulty, techStack, tasksCount }) {
  const d = difficulty || 'medium';
  const stack = Array.isArray(techStack) ? techStack : [];
  const count = Number.isFinite(tasksCount) ? tasksCount : 2;

  return {
    title: titleHint || 'Generated Assessment',
    description:
      'MVP draft generated without Groq (set GROQ_API_KEY to enable AI generation).',
    techStack: stack,
    revealThreshold: 70,
    mentorStrictness: 5,
    tasks: Array.from({ length: Math.max(1, Math.min(5, count)) }).map(
      (_, idx) => ({
        title: `Task ${idx + 1}: Backend + API reasoning`,
        prompt:
          'Build a small API feature that matches the job description. Include validation, error handling, and tests. Explain tradeoffs briefly in comments or README.',
        difficulty: d,
        tags: ['generated', ...stack.slice(0, 5)],
        hiddenTests: [
          {
            name: 'Handles invalid input',
            input: '{"bad":true}',
            expectedOutput: 'HTTP 400',
          },
          {
            name: 'Handles happy path',
            input: '{"ok":true}',
            expectedOutput: 'HTTP 200',
          },
        ],
        rubric: {
          correctness: ['Meets the API contract', 'Validates inputs'],
          efficiency: ['No unnecessary queries/work'],
          codeQuality: ['Readable structure', 'Good naming', 'Tests included'],
        },
      })
    ),
  };
}

const taskCreatorService = {
  async generateAssessmentDraft({
    jobDescription,
    titleHint,
    difficulty,
    techStack,
    tasksCount,
    revealThreshold,
    config,
  }) {
    try {
      const grokTaskCreator = await getGrokTaskCreator(config);
      if (grokTaskCreator) {
        return await grokTaskCreator.generate({
          jobDescription,
          titleHint: titleHint || '',
          difficulty: difficulty || 'medium',
          tasksCount: tasksCount || 2,
          techStack: Array.isArray(techStack) ? techStack : [],
          revealThreshold: Number.isFinite(revealThreshold)
            ? revealThreshold
            : 70,
        });
      }
    } catch (err) {
      logger.warn('Task creator unavailable; falling back to deterministic', {
        message: err?.message,
      });
    }

    return deterministicDraft({ titleHint, difficulty, techStack, tasksCount });
  },
};

module.exports = { taskCreatorService };
