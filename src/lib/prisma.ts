import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

/**
 * Prisma Client singleton — prevents multiple instances in development (HMR)
 * Pattern: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 *
 * Prisma 7 uses the "client" engine type by default, which REQUIRES a driver adapter.
 * We use @prisma/adapter-pg with explicit SSL config for Supabase.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  // Supabase requires SSL for external connections.
  // pg library handles SSL separately from the connection string.
  // We strip ?sslmode=* from the URL and handle it via the Pool config instead.
  const isLocalhost =
    connectionString.includes('localhost') ||
    connectionString.includes('127.0.0.1')

  const pool = new Pool({
    connectionString,
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
  })

  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
