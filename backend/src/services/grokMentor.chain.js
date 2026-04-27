const { z } = require('zod');

const hintOutputSchema = z
  .object({
    hint: z.string().min(1).max(800),
    style: z.literal('non-spoiler'),
    doNotProvide: z
      .array(z.string())
      .default(['full solution', 'complete code', 'final answer']),
  })
  .strict();

async function createGrokMentor({ grokConfig }) {
  // LangChain packages are ESM; load via dynamic import from CJS.
  const [{ ChatOpenAI }, { ChatPromptTemplate }] = await Promise.all([
    import('@langchain/openai'),
    import('@langchain/core/prompts'),
  ]);

  const model = new ChatOpenAI({
    apiKey: grokConfig.apiKey,
    model: grokConfig.model,
    temperature: 0.3,
    // OpenAI-compatible base URL (Grok)
    configuration: {
      baseURL: grokConfig.baseUrl,
    },
  });

  // Best-practice prompt: hints only, no solutions, avoid code.
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      [
        'You are an AI mentor for coding assessments.',
        'You MUST give guidance/hints only. Do NOT provide the full solution, final code, or the final answer.',
        'Keep it short and actionable (1-4 sentences).',
        'If the user asks for the solution, refuse and give a hint instead.',
        'Return output strictly as JSON matching this schema:',
        '{"hint": string, "style": "non-spoiler", "doNotProvide": string[]}',
      ].join(' '),
    ],
    ['human', 'Prompt: {prompt}\nAttempt: {attemptNumber}'],
  ]);

  const runnable = prompt.pipe(model);

  async function getHint({ prompt: userPrompt, attemptNumber = 1 }) {
    const res = await runnable.invoke({
      prompt: userPrompt,
      attemptNumber,
    });

    // ChatOpenAI returns an AIMessage-like object with .content
    const content =
      typeof res?.content === 'string' ? res.content : JSON.stringify(res);

    // Extract JSON in a tolerant way (model sometimes wraps with text)
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
      // fallback: treat whole content as hint
      parsed = {
        hint: String(content).slice(0, 800),
        style: 'non-spoiler',
        doNotProvide: ['full solution'],
      };
    }

    const validated = hintOutputSchema.safeParse(parsed);
    if (!validated.success) {
      return {
        hint: String(parsed?.hint || content).slice(0, 800),
        style: 'non-spoiler',
        doNotProvide: ['full solution'],
      };
    }

    return validated.data;
  }

  return { getHint };
}

module.exports = { createGrokMentor };
