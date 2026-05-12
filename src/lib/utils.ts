import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes without conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a Date to Thai locale string
 * @example formatDate(new Date()) // "12 พฤษภาคม 2568"
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}

/**
 * Format a number to display with decimal places
 * @example formatNumber(123.456, 1) // "123.5"
 */
export function formatNumber(value: number, decimals = 0): string {
  return value.toFixed(decimals)
}

/**
 * Calculate total purine from amount in grams and purine per 100g
 */
export function calculatePurine(purinePerHg: number, amountGrams: number): number {
  return (purinePerHg * amountGrams) / 100
}

/**
 * Get purine level label in Thai
 */
export function getPurineLevelLabel(
  level: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW'
): {
  label: string
  color: string
  bgColor: string
} {
  const map = {
    VERY_HIGH: { label: 'สูงมาก (>300 mg)', color: 'text-red-700', bgColor: 'bg-red-100' },
    HIGH: { label: 'สูง (150-300 mg)', color: 'text-orange-700', bgColor: 'bg-orange-100' },
    MODERATE: { label: 'ปานกลาง (50-150 mg)', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
    LOW: { label: 'ต่ำ (<50 mg)', color: 'text-green-700', bgColor: 'bg-green-100' },
  }
  return map[level]
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Calculate percentage, capped at 100
 */
export function calcPercent(value: number, max: number): number {
  return clamp((value / max) * 100, 0, 100)
}

/**
 * Async sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generate initials from a name string
 * @example getInitials("สมชาย ใจดี") // "สใ"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
