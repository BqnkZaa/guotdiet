import { z } from 'zod'

// ============================================================
// Zod schemas for API validation & type inference
// ============================================================

// Schema for Step 1: ingredient extraction only (no purine values yet)
export const AiExtractedIngredientSchema = z.object({
  name: z.string(),
  estimatedGrams: z.number(),
})

export const AiIngredientSchema = z.object({
  name: z.string(),
  estimatedGrams: z.number(),
  purinePerHg: z.number(),
  purineActual: z.number(),
  riskLevel: z.enum(['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH']),
  fromDatabase: z.boolean(),              // true = DB data, false = AI estimate
  matchedFoodName: z.string().optional(), // Thai food name matched from DB
})

export const AiRecommendationSchema = z.object({
  title: z.string(),
  message: z.string(),
  type: z.enum(['success', 'warning', 'danger', 'info']),
})

export const AiAlternativeSchema = z.object({
  menuName: z.string(),
  reason: z.string(),
  estimatedPurine: z.number(),
})

export const AiMealAnalysisSchema = z.object({
  menuName: z.string(),
  menuNameEn: z.string(),
  totalPurineMg: z.number(),
  riskLevel: z.enum(['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH']),
  ingredients: z.array(AiIngredientSchema),
  recommendations: z.array(AiRecommendationSchema),
  alternatives: z.array(AiAlternativeSchema),
  disclaimer: z.string(),
})

// ============================================================
// TypeScript types derived from schemas
// ============================================================

export type AiExtractedIngredient = z.infer<typeof AiExtractedIngredientSchema>
export type AiIngredient = z.infer<typeof AiIngredientSchema>
export type AiRecommendation = z.infer<typeof AiRecommendationSchema>
export type AiAlternative = z.infer<typeof AiAlternativeSchema>
export type AiMealAnalysis = z.infer<typeof AiMealAnalysisSchema>

// ============================================================
// API request/response types
// ============================================================

export const AnalyzeMealRequestSchema = z.object({
  menuName: z.string().min(1, 'กรุณาระบุชื่อเมนู').max(200, 'ชื่อเมนูยาวเกินไป'),
})

export type AnalyzeMealRequest = z.infer<typeof AnalyzeMealRequestSchema>

export interface AnalyzeMealResponse {
  success: boolean
  data?: AiMealAnalysis
  error?: string
}
