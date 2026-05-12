const path = require('path');
const dotenv = require('dotenv');
const { z } = require('zod');

function loadConfig() {
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Load .env by default (production uses real env vars)
  if (nodeEnv !== 'production') {
    dotenv.config({ path: path.join(process.cwd(), '.env') });
  }

  const schema = z.object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(8080),
    CORS_ORIGIN: z.string().default('*'),
    LOG_LEVEL: z
      .enum(['error', 'warn', 'info', 'http', 'debug'])
      .default('info'),
    HASH_SALT: z.string().min(8).default('dev-only-change-me'),
    // Preferred: Groq (OpenAI-compatible)
    GROQ_API_KEY: z.string().optional(),
    GROQ_BASE_URL: z
      .string()
      .url()
      .default('https://api.groq.com/openai/v1'),
    GROQ_MODEL: z.string().default('llama-3.3-70b-versatile'),

    // Backward compatibility: Grok (xAI)
    GROK_API_KEY: z.string().optional(),
    GROK_BASE_URL: z.string().url().default('https://api.x.ai/v1'),
    GROK_MODEL: z.string().default('grok-2-latest'),

    MONGODB_URI: z.string().optional(),
    JWT_SECRET: z.string().min(16).default('dev-only-change-me-please'),
    JWT_EXPIRES_IN: z.string().default('7d'),
  });

  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }

  const env = parsed.data;

  const groqEnabled = Boolean(env.GROQ_API_KEY);
  const grokEnabled = Boolean(env.GROK_API_KEY);

  const llm = groqEnabled
    ? {
        provider: 'groq',
        apiKey: env.GROQ_API_KEY,
        baseUrl: env.GROQ_BASE_URL,
        model: env.GROQ_MODEL,
        enabled: true,
      }
    : {
        provider: 'grok',
        apiKey: env.GROK_API_KEY,
        baseUrl: env.GROK_BASE_URL,
        model: env.GROK_MODEL,
        enabled: grokEnabled,
      };

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    corsOrigin: env.CORS_ORIGIN,
    logLevel: env.LOG_LEVEL,
    hashSalt: env.HASH_SALT,
    // New preferred config key
    groq: llm,

    // Backward compatible alias (some services still read config.grok)
    grok: llm,

    mongodb: {
      uri: env.MONGODB_URI,
      enabled: Boolean(env.MONGODB_URI),
    },

    auth: {
      jwtSecret: env.JWT_SECRET,
      jwtExpiresIn: env.JWT_EXPIRES_IN,
    },
  };
}

module.exports = { loadConfig };
