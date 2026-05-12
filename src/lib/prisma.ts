import { PrismaClient } from '@prisma/client'

/**
 * Prisma Client singleton — prevents multiple instances in development (HMR)
 * 
 * We use the native Prisma Rust engine (engineType = "library") instead of the pg adapter
 * because Vercel Serverless functions can have DNS resolution issues (IPv6) with Supabase
 * when using the Node.js pg module directly without connection pooling.
 * Prisma's native engine handles IPv6 and fallback automatically.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
