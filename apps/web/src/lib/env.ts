import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL:    z.string().min(1),
  SESSION_SECRET:  z.string().min(32),
  STAFF_PASSWORD:  z.string().min(1),
  NODE_ENV:        z.enum(['development', 'production', 'test']).default('development'),
})

function getEnv() {
  // next build 中 (NEXT_PHASE=phase-production-build) はバリデーションをスキップ
  // Railway のビルド時に環境変数が未設定でもビルドを通すため
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return {
      DATABASE_URL:    process.env.DATABASE_URL    ?? 'postgresql://build-placeholder',
      SESSION_SECRET:  process.env.SESSION_SECRET  ?? 'build-placeholder-secret-32chars!!',
      STAFF_PASSWORD:  process.env.STAFF_PASSWORD  ?? 'build-placeholder',
      NODE_ENV:        (process.env.NODE_ENV ?? 'production') as 'development' | 'production' | 'test',
    }
  }
  return envSchema.parse(process.env as Record<string, string>)
}

export const env = getEnv()
