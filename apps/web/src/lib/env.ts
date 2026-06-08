import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL:    z.string().min(1),
  SESSION_SECRET:  z.string().min(32),
  STAFF_PASSWORD:  z.string().min(1),
  NODE_ENV:        z.enum(['development', 'production', 'test']).default('development'),
})

export const env = envSchema.parse(process.env as Record<string, string>)
