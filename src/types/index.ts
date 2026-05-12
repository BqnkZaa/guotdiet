/**
 * Global TypeScript type declarations
 * Domain types for the Gout Diet Control Platform
 */

// ---- Purine & Food Types ---------------------------------------------------

export type PurineLevel = 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW'

export type FoodCategory =
  | 'MEAT'
  | 'SEAFOOD'
  | 'POULTRY'
  | 'ORGAN_MEAT'
  | 'LEGUMES'
  | 'VEGETABLES'
  | 'FRUITS'
  | 'GRAINS'
  | 'DAIRY'
  | 'BEVERAGES'
  | 'OTHER'

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'

// ---- Dashboard Summary Types -----------------------------------------------

export interface DailySummary {
  date: Date
  totalPurineMg: number
  mealCount: number
  targetPurineMg: number
  percentUsed: number
}

// ---- API Response Wrappers -------------------------------------------------

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ---- UI Types --------------------------------------------------------------

export type ThemeMode = 'light' | 'dark' | 'system'

export interface BreadcrumbItem {
  label: string
  href?: string
}
