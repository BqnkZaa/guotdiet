import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

/**
 * Prisma Client singleton — prevents multiple instances in development (HMR)
 *
 * Prisma 7 uses "client" engine type by default — this requires a driver adapter.
 * We use @prisma/adapter-pg.
 *
 * NOTE: For Vercel + Supabase, use the Supabase Session/Transaction Pooler URL
 * (NOT the Direct Connection) to avoid IPv6 incompatibility on Vercel Serverless.
 * See: https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const isLocalhost =
    connectionString.includes('localhost') ||
    connectionString.includes('127.0.0.1')

  const pool = new Pool({
    connectionString,
    // SSL is required for Supabase. rejectUnauthorized: false allows self-signed certs.
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
  })

  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
