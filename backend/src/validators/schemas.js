const { z } = require('zod');

const taskSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(1),
    prompt: z.string().min(1),
    exampleInput: z.string().max(10000).optional(),
    exampleOutput: z.string().max(10000).optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    tags: z.array(z.string()).optional(),
  })
  .strict();

const createAssessmentSchema = z
  .object({
    companyId: z.string().nullable().optional(),
    title: z.string().min(2),
    description: z.string().optional(),
    tasks: z.array(taskSchema).default([]),
    revealThreshold: z.number().int().min(0).max(100).optional(),
    techStack: z.array(z.string()).optional(),
    mentorStrictness: z.number().int().min(0).max(10).optional(),
  })
  .strict();

const startSessionSchema = z
  .object({
    candidateName: z.string().min(1).max(120).optional(),
    candidateEmail: z.string().email().optional(),
  })
  .strict();

const replayEventSchema = z
  .object({
    type: z.enum(['KEYSTROKE', 'RUN', 'TEST', 'HINT', 'SUBMIT', 'FOCUS', 'BLUR', 'CUSTOM']),
    payload: z.any().optional(),
    ts: z.number().int().optional(),
  })
  .strict();

const submitSchema = z
  .object({
    passed: z.boolean(),
    timeMs: z.number().int().min(0).optional(),
    hintsUsed: z.number().int().min(0).optional(),
    testsPassed: z.number().int().min(0).optional(),
    testsTotal: z.number().int().min(0).optional(),
    language: z.string().optional(),
    notes: z.string().max(2000).optional(),
  })
  .strict();

const mentorHintSchema = z
  .object({
    prompt: z.string().min(1).max(5000),
    attemptNumber: z.number().int().min(1).max(50).optional(),
  })
  .strict();

const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8).max(200),
    name: z.string().min(1).max(120).optional(),
    role: z.enum(['candidate', 'company', 'recruiter']).optional(),
  })
  .strict();

const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1).max(200),
  })
  .strict();

const updateProfileSchema = z
  .object({
    name: z.string().min(1).max(120).nullable().optional(),
    resumeUrl: z.string().max(500).nullable().optional(),
    githubUrl: z.string().max(500).nullable().optional(),
    portfolioUrl: z.string().max(500).nullable().optional(),
  })
  .strict();

const pipelineMoveSchema = z
  .object({
    publicId: z.string().min(8).max(128),
    toStage: z.enum(['Tech Interview', 'Culture Fit', 'Offer']),
  })
  .strict();

module.exports = {
  createAssessmentSchema,
  startSessionSchema,
  replayEventSchema,
  submitSchema,
  mentorHintSchema,
  registerSchema,
  loginSchema,
  pipelineMoveSchema,
  updateProfileSchema,
};
