const { z } = require('zod');

const generatedTaskSchema = z
  .object({
    title: z.string().min(2).max(160),
    prompt: z.string().min(40).max(20_000),
    exampleInput: z.string().max(10_000).optional(),
    exampleOutput: z.string().max(10_000).optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    tags: z.array(z.string()).max(20).optional(),

    // "Hidden" tests + rubric are stored for recruiter/admin use.
    // They are optional because the MVP app may not execute them yet.
    hiddenTests: z
      .array(
        z
          .object({
            name: z.string().max(200).optional(),
            input: z.string().max(10_000),
            expectedOutput: z.string().max(10_000),
          })
          .strict()
      )
      .max(30)
      .optional(),
    rubric: z
      .object({
        correctness: z.array(z.string()).max(20).optional(),
        efficiency: z.array(z.string()).max(20).optional(),
        codeQuality: z.array(z.string()).max(20).optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

const generatedAssessmentSchema = z
  .object({
    title: z.string().min(2).max(160),
    description: z.string().max(20_000).optional(),
    techStack: z.array(z.string()).max(20).optional(),
    revealThreshold: z.number().int().min(0).max(100).optional(),
    mentorStrictness: z.number().int().min(0).max(10).optional(),
    tasks: z.array(generatedTaskSchema).min(1).max(5),
  })
  .strict();

async function createTaskCreator({ grokConfig }) {
  // LangChain packages are ESM; load via dynamic import from CJS.
  const [{ ChatOpenAI }, { ChatPromptTemplate }] = await Promise.all([
    import('@langchain/openai'),
    import('@langchain/core/prompts'),
  ]);

  const llmConfig = grokConfig;

  const model = new ChatOpenAI({
    apiKey: llmConfig.apiKey,
    model: llmConfig.model,
    temperature: 0.2,
    configuration: {
      baseURL: llmConfig.baseUrl,
    },
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      [
        'You generate coding assessments for recruiters from a job description.',
        'Return ONLY valid JSON (no markdown, no commentary).',
        'The JSON MUST match this TypeScript-like shape:',
        '{ title: string, description?: string, techStack?: string[], revealThreshold?: number, mentorStrictness?: number, tasks: Array<{ title: string, prompt: string, exampleInput?: string, exampleOutput?: string, difficulty?: "easy"|"medium"|"hard", tags?: string[], hiddenTests?: Array<{ name?: string, input: string, expectedOutput: string }>, rubric?: { correctness?: string[], efficiency?: string[], codeQuality?: string[] } }> }',
        'Guidelines:',
        '- Make tasks realistic and aligned to the JD.',
        '- Include 5-10 hidden tests per task when possible.',
        '- Rubric should be short bullet points in arrays.',
        '- Prompts must be self-contained and unambiguous.',
      ].join(' '),
    ],
    [
      'human',
      [
        'Job description:\n{jobDescription}',
        'Title hint: {titleHint}',
        'Difficulty: {difficulty}',
        'Tasks count: {tasksCount}',
        'Preferred tech stack: {techStack}',
        'Reveal threshold: {revealThreshold}',
      ].join('\n'),
    ],
  ]);

  const runnable = prompt.pipe(model);

  async function generate(input) {
    const res = await runnable.invoke(input);

    const content = typeof res?.content === 'string' ? res.content : '';
    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    const jsonStr =
      firstBrace >= 0 && lastBrace >= 0
        ? content.slice(firstBrace, lastBrace + 1)
        : content;

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      parsed = null;
    }

    const validated = generatedAssessmentSchema.safeParse(parsed);
    if (validated.success) return validated.data;

    // Last-resort fallback: create a minimal assessment.
    return {
      title: String(input?.titleHint || 'Generated Assessment').slice(0, 160),
      description: 'Auto-generated draft (model output was not parseable).',
      techStack: Array.isArray(input?.techStack) ? input.techStack : [],
      revealThreshold: Number.isFinite(input?.revealThreshold)
        ? input.revealThreshold
        : 70,
      mentorStrictness: 5,
      tasks: [
        {
          title: 'Task 1',
          prompt: String(input?.jobDescription || '').slice(0, 2000) ||
            'Implement the requirements described in the job description.',
          difficulty: input?.difficulty || 'medium',
          tags: ['generated'],
        },
      ],
    };
  }

  return { generate };
}

module.exports = { createTaskCreator, generatedAssessmentSchema };
