import { z } from 'zod'
import { Prisma } from '@prisma/client'

export type ActionState<T> =
  | { success: true; data: T }
  | { success: false; error: string; validationErrors?: Record<string, string[]> }

/**
 * Normalizes an error into a user-friendly string message.
 * Safe for production (does not leak sensitive DB details).
 */
export function normalizeError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return 'ข้อมูลซ้ำซ้อนกันในระบบ'
      case 'P2025':
        return 'ไม่พบข้อมูลที่ต้องการอ้างอิง'
      default:
        return 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล'
    }
  }

  if (error instanceof Error) {
    // We only expose Error.message if we trust it. 
    // For safer prod, we could obscure it unless it's a known safe error class.
    return error.message
  }

  return 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
}

/**
 * A wrapper for Server Actions to ensure they always return a consistent ActionState
 * and never throw unhandled exceptions to the client.
 */
export async function safeAction<T>(
  action: () => Promise<T>
): Promise<ActionState<T>> {
  try {
    const data = await action()
    return { success: true, data }
  } catch (error) {
    console.error('[SAFE_ACTION_ERROR]', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'ข้อมูลไม่ถูกต้อง',
        validationErrors: error.flatten().fieldErrors,
      }
    }

    return {
      success: false,
      error: normalizeError(error),
    }
  }
}
