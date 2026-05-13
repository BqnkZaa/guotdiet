import { prisma } from '@/lib/prisma'
import { Food } from '@prisma/client'

// ============================================================
// Types
// ============================================================

export interface ExtractedIngredient {
  name: string
  estimatedGrams: number
}

export interface EnrichedIngredient {
  name: string
  estimatedGrams: number
  purinePerHg: number
  purineActual: number
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH'
  fromDatabase: boolean
  matchedFoodName?: string
}

// ============================================================
// Helpers
// ============================================================

function classifyRiskLevel(purinePerHg: number): 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH' {
  if (purinePerHg > 300) return 'VERY_HIGH'
  if (purinePerHg >= 150) return 'HIGH'
  if (purinePerHg >= 50) return 'MODERATE'
  return 'LOW'
}

/**
 * Strips common Thai cooking particles / modifiers so the core ingredient
 * name can be matched against the database more reliably.
 *
 * Examples:
 *   "เนื้อหมูสับ"    → "หมู"        (สับ = minced)
 *   "กุ้งสด"         → "กุ้ง"       (สด = fresh)
 *   "น้ำมันพืช"      → "น้ำมัน"
 */
function stripThaiModifiers(text: string): string {
  const modifiers = [
    'สับ', 'สด', 'แห้ง', 'ต้ม', 'ทอด', 'ย่าง', 'นึ่ง', 'อบ', 'รมควัน',
    'หั่น', 'บด', 'แล่', 'ติดกระดูก', 'ไม่ติดกระดูก',
    'ขาว', 'แดง', 'เขียว', 'เหลือง',
    'ใหญ่', 'เล็ก', 'กลาง',
    'กระป๋อง', 'แช่แข็ง', 'สุก',
  ]

  let result = text.trim()
  for (const mod of modifiers) {
    result = result.replace(new RegExp(mod + '$'), '').trim()
  }
  return result
}

/**
 * Generates multiple search terms from a single ingredient name:
 *  - Original name
 *  - Name with Thai modifiers stripped
 *  - First word (for compound names)
 */
function buildSearchTerms(name: string): string[] {
  const normalized = name.trim().toLowerCase()
  const stripped = stripThaiModifiers(normalized)
  const firstWord = normalized.split(/\s+/)[0] ?? ''

  return [...new Set([normalized, stripped, firstWord].filter((t): t is string => t.length > 1))]
}

// ============================================================
// Core lookup function
// ============================================================

/**
 * Finds the best-matching Food record for an ingredient name.
 * Tries multiple search terms and returns the first match found.
 */
export async function findBestMatch(ingredientName: string): Promise<Food | null> {
  const terms = buildSearchTerms(ingredientName)

  for (const term of terms) {
    const results = await prisma.food.findMany({
      where: {
        OR: [
          { nameTh: { contains: term, mode: 'insensitive' } },
          { nameEn: { contains: term, mode: 'insensitive' } },
          { aliases: { hasSome: [term] } },
        ],
      },
      orderBy: { purinePerHg: 'asc' }, // prefer lower-ranked match if ambiguous
      take: 1,
    })

    if (results.length > 0) {
      return results[0] ?? null
    }
  }

  return null
}

// ============================================================
// Batch enrichment
// ============================================================

/**
 * Takes a list of extracted ingredients (name + grams) and enriches them
 * with real purine data from the database wherever possible.
 *
 * - If a DB match is found: use DB purinePerHg to calculate purineActual
 * - If no DB match: fall back to the AI-estimated values provided in `aiFallback`
 */
export async function enrichIngredientsWithDbData(
  extracted: ExtractedIngredient[],
  aiFallback: { name: string; purinePerHg: number }[]
): Promise<EnrichedIngredient[]> {
  const enriched: EnrichedIngredient[] = []

  for (const ing of extracted) {
    const match = await findBestMatch(ing.name)

    if (match) {
      const purineActual = (ing.estimatedGrams / 100) * match.purinePerHg

      enriched.push({
        name: ing.name,
        estimatedGrams: ing.estimatedGrams,
        purinePerHg: match.purinePerHg,
        purineActual,
        riskLevel: classifyRiskLevel(match.purinePerHg),
        fromDatabase: true,
        matchedFoodName: match.nameTh,
      })
    } else {
      // Fallback: use AI-estimated purinePerHg from the second step
      const fallback = aiFallback.find(
        (f) => f.name.toLowerCase() === ing.name.toLowerCase()
      )
      const purinePerHg = fallback?.purinePerHg ?? 0
      const purineActual = (ing.estimatedGrams / 100) * purinePerHg

      enriched.push({
        name: ing.name,
        estimatedGrams: ing.estimatedGrams,
        purinePerHg,
        purineActual,
        riskLevel: classifyRiskLevel(purinePerHg),
        fromDatabase: false,
      })
    }
  }

  return enriched
}
