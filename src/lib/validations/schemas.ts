import { z } from 'zod'

// =============================================================================
// AUTH SCHEMAS
// =============================================================================

export const loginSchema = z.object({
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร').max(100),
    email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
    password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร').max(100),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],
  })

// =============================================================================
// MEAL LOG SCHEMAS
// =============================================================================

export const mealItemSchema = z.object({
  foodId: z.string().cuid(),
  amountGrams: z.number().positive('ปริมาณต้องมากกว่า 0').max(5000),
})

export const mealLogSchema = z.object({
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  logDate: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
  items: z.array(mealItemSchema).min(1, 'กรุณาเพิ่มอาหารอย่างน้อย 1 รายการ'),
})

// =============================================================================
// URIC ACID LOG SCHEMAS
// =============================================================================

export const uricAcidLogSchema = z.object({
  valueMgDl: z
    .number()
    .min(1, 'ค่ากรดยูริกไม่ถูกต้อง')
    .max(25, 'ค่ากรดยูริกไม่ถูกต้อง'),
  logDate: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
})

// =============================================================================
// FOOD SCHEMA (admin)
// =============================================================================

export const foodSchema = z.object({
  nameTh: z.string().min(1).max(200),
  nameEn: z.string().min(1).max(200),
  category: z.enum([
    'MEAT',
    'SEAFOOD',
    'POULTRY',
    'ORGAN_MEAT',
    'LEGUMES',
    'VEGETABLES',
    'FRUITS',
    'GRAINS',
    'DAIRY',
    'BEVERAGES',
    'OTHER',
  ]),
  purineLevel: z.enum(['VERY_HIGH', 'HIGH', 'MODERATE', 'LOW']),
  purinePerHg: z.number().min(0).max(2000),
  unit: z.string().default('g'),
})

// =============================================================================
// USER PROFILE SCHEMA
// =============================================================================

export const userProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  birthYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  weightKg: z.number().min(20).max(300).optional(),
  heightCm: z.number().min(50).max(300).optional(),
  targetPurineMgPerDay: z.number().min(100).max(1000).optional(),
})

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type MealLogInput = z.infer<typeof mealLogSchema>
export type UricAcidLogInput = z.infer<typeof uricAcidLogSchema>
export type FoodInput = z.infer<typeof foodSchema>
export type UserProfileInput = z.infer<typeof userProfileSchema>

export const mealItemInputSchema = z.object({
  foodId: z.string().cuid('รหัสอาหารไม่ถูกต้อง'),
  name: z.string(),
  purinePerHg: z.number().nonnegative(),
  amountGrams: z.number().min(1, 'ปริมาณต้องมากกว่า 0 กรัม').max(5000, 'ปริมาณมากเกินไป (สูงสุด 5000 กรัม)'),
  category: z.string(),
})

export const saveMealSchema = z.object({
  items: z.array(mealItemInputSchema).min(1, 'ต้องมีอาหารอย่างน้อย 1 รายการ'),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']).default('LUNCH'),
  notes: z.string().max(500).optional(),
})
