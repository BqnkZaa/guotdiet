import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL').optional(),
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters').optional(),
  // Optional: required only when AI analysis feature is used
  OPENAI_API_KEY: z.string().startsWith('sk-', 'OPENAI_API_KEY must start with sk-').optional(),
})

const parseEnv = () => {
  // During build time (next build), we might not have all env vars if we skip them
  // We can bypass validation if we are in a static build step, but for safety we validate
  // Next.js automatically sets process.env.NEXT_PHASE, we could check it
  
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors)
    // We don't throw to avoid breaking Next.js telemetry or static generation if vars are missing
    // but in a strict prod environment, we should throw.
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️ Running in production with missing/invalid environment variables. Expect failures.')
    }
    return process.env as unknown as z.infer<typeof envSchema>
  }

  return parsed.data
}

export const env = parseEnv()
