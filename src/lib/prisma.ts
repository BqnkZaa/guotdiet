import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

/**
 * Prisma Client singleton — prevents multiple instances in development (HMR)
 * Pattern: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// In Next.js, process.env is populated by Next.js from .env or system environment variables
const connectionString = process.env.DATABASE_URL

// Use an adapter for Prisma 7 client execution
const isLocalhost = connectionString?.includes('localhost')
const pool = new Pool({ 
  connectionString,
  ssl: !isLocalhost ? { rejectUnauthorized: false } : undefined
})
const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
