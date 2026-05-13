import { openai } from '@/lib/openai'
import { AiMealAnalysis, AiMealAnalysisSchema, AiExtractedIngredient } from '@/types/ai-meal'
import { enrichIngredientsWithDbData } from '@/services/food-lookup.service'
import { z } from 'zod'

// ============================================================
// Step 1 — Ingredient Extraction Prompt & Schema
// ============================================================

const EXTRACTION_SYSTEM_PROMPT = `คุณเป็นผู้เชี่ยวชาญด้านโภชนาการและอาหารไทย
เมื่อผู้ใช้ระบุชื่อเมนูอาหาร ให้วิเคราะห์และระบุส่วนประกอบหลักของเมนูนั้น พร้อมปริมาณโดยประมาณ

ตอบกลับเป็น JSON เท่านั้น รูปแบบ:
{
  "menuName": "ชื่อเมนูภาษาไทย",
  "menuNameEn": "ชื่อเมนูภาษาอังกฤษ",
  "ingredients": [
    { "name": "ชื่อส่วนประกอบภาษาไทย (ชื่อเดียวกับวัตถุดิบ ไม่ใส่วิธีปรุง)", "estimatedGrams": <ตัวเลข> }
  ]
}

ข้อกำหนด:
- ระบุส่วนประกอบหลักที่มีพิวรีนเป็นสำคัญ (เนื้อ, ผัก, ถั่ว, อาหารทะเล)
- ปริมาณตามมาตรฐาน 1 จาน/1 ชาม ของอาหารไทย
- ชื่อส่วนประกอบต้องเป็นชื่อวัตถุดิบดิบๆ เช่น "หมู", "กุ้ง", "เต้าหู้" ไม่ใช่ "หมูสับทอด"
- ไม่ต้องระบุเครื่องปรุงรส เช่น น้ำปลา, น้ำตาล, เกลือ
- ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น`

const ExtractionResultSchema = z.object({
  menuName: z.string(),
  menuNameEn: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      estimatedGrams: z.number(),
    })
  ),
})

// ============================================================
// Step 2 — Recommendation Generation Prompt
// ============================================================

function buildRecommendationPrompt(
  menuName: string,
  menuNameEn: string,
  totalPurineMg: number,
  ingredients: {
    name: string
    estimatedGrams: number
    purinePerHg: number
    purineActual: number
    fromDatabase: boolean
  }[]
): string {
  const ingredientSummary = ingredients
    .map(
      (ing) =>
        `- ${ing.name}: ${ing.estimatedGrams}g, พิวรีน ${ing.purinePerHg.toFixed(1)} mg/100g (จริง: ${ing.purineActual.toFixed(1)} mg) ${ing.fromDatabase ? '[จากฐานข้อมูล]' : '[ประมาณการ]'}`
    )
    .join('\n')

  return `คุณเป็นผู้เชี่ยวชาญด้านโภชนาการคลินิกสำหรับผู้ป่วยโรคเกาต์ในประเทศไทย

ข้อมูลมื้ออาหารนี้ได้คำนวณจากฐานข้อมูลพิวรีนทางการแพทย์แล้ว:
เมนู: ${menuName} (${menuNameEn})
ส่วนประกอบ:
${ingredientSummary}
พิวรีนรวมทั้งมื้อ: ${totalPurineMg.toFixed(1)} mg

จากข้อมูลนี้ ตอบกลับเป็น JSON รูปแบบ:
{
  "recommendations": [
    {
      "title": "หัวข้อคำแนะนำภาษาไทย",
      "message": "รายละเอียดคำแนะนำสำหรับผู้ป่วยเกาต์",
      "type": "success" หรือ "warning" หรือ "danger" หรือ "info"
    }
  ],
  "alternatives": [
    {
      "menuName": "ชื่อเมนูทดแทน",
      "reason": "เหตุผลที่เหมาะสมกว่า",
      "estimatedPurine": <ตัวเลข mg>
    }
  ],
  "disclaimer": "ข้อความ disclaimer เกี่ยวกับความถูกต้องของข้อมูล"
}

ข้อกำหนด:
- ให้ recommendations อย่างน้อย 2-3 ข้อที่เป็นประโยชน์จริงๆ ตามระดับพิวรีนรวม
- ให้ alternatives อย่างน้อย 2 เมนูที่มีพิวรีนต่ำกว่า
- คำแนะนำต้องสอดคล้องกับค่าพิวรีนจริงที่คำนวณได้ ไม่ใช่ประมาณเอง
- ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น`
}

const RecommendationResultSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string(),
      message: z.string(),
      type: z.enum(['success', 'warning', 'danger', 'info']),
    })
  ),
  alternatives: z.array(
    z.object({
      menuName: z.string(),
      reason: z.string(),
      estimatedPurine: z.number(),
    })
  ),
  disclaimer: z.string(),
})

// ============================================================
// Risk classification (mirrors purine.service.ts)
// ============================================================

function classifyMealRiskLevel(totalPurineMg: number): 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH' {
  if (totalPurineMg > 400) return 'VERY_HIGH'
  if (totalPurineMg > 200) return 'HIGH'
  if (totalPurineMg > 100) return 'MODERATE'
  return 'LOW'
}

// ============================================================
// Main exported function
// ============================================================

/**
 * Analyzes a Thai dish using a 2-step RAG pipeline:
 *
 * 1. AI extracts ingredients + estimated grams (no purine guessing)
 * 2. System looks up real purine values from the DB and calculates actual content
 * 3. AI generates recommendations based on the real data
 */
export async function analyzeMeal(menuName: string): Promise<AiMealAnalysis> {
  // ── Step 1: Extract ingredients ───────────────────────────
  const extractionCompletion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `ระบุส่วนประกอบของเมนูนี้: "${menuName}"`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
    max_tokens: 800,
  })

  const rawExtraction = extractionCompletion.choices[0]?.message?.content
  if (!rawExtraction) throw new Error('ไม่ได้รับผลลัพธ์จาก AI (step 1)')

  let extractionParsed: unknown
  try {
    extractionParsed = JSON.parse(rawExtraction)
  } catch {
    throw new Error('ผลลัพธ์ step 1 จาก AI ไม่ถูกต้อง (JSON parse error)')
  }

  const extractionValidated = ExtractionResultSchema.safeParse(extractionParsed)
  if (!extractionValidated.success) {
    console.error('[AI Meal Service] Step 1 schema error:', extractionValidated.error.flatten())
    throw new Error('ผลลัพธ์ step 1 ไม่ตรงตาม schema')
  }

  const { menuName: extractedMenuName, menuNameEn, ingredients: extracted } = extractionValidated.data

  console.log(`[AI Meal] Step 1 extracted ${extracted.length} ingredients for "${menuName}"`)

  // ── Step 2: DB lookup + purine calculation ────────────────
  // Pass empty fallback — any unmatched ingredient will have purinePerHg = 0
  // We'll do a targeted AI fallback for those below
  const enrichedWithDb = await enrichIngredientsWithDbData(
    extracted as AiExtractedIngredient[],
    [] // No AI fallback in first pass
  )

  // Check if any ingredients were not found in DB
  const notFoundIngredients = enrichedWithDb.filter((i) => !i.fromDatabase)

  // If some ingredients weren't found, ask AI to estimate their purine values
  let enrichedFinal = enrichedWithDb
  if (notFoundIngredients.length > 0) {
    console.log(
      `[AI Meal] ${notFoundIngredients.length} ingredients not found in DB, requesting AI fallback estimates`
    )

    const fallbackPrompt = `ประมาณค่าพิวรีนต่อ 100g สำหรับวัตถุดิบเหล่านี้:
${notFoundIngredients.map((i) => `- ${i.name}`).join('\n')}

ตอบกลับเป็น JSON: { "estimates": [{ "name": "...", "purinePerHg": <number> }] }
ตอบเป็น JSON เท่านั้น`

    const fallbackCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'คุณเป็นผู้เชี่ยวชาญด้านโภชนาการ ตอบเป็น JSON เท่านั้น',
        },
        { role: 'user', content: fallbackPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 400,
    })

    const rawFallback = fallbackCompletion.choices[0]?.message?.content
    if (rawFallback) {
      try {
        const parsed = JSON.parse(rawFallback) as { estimates?: { name: string; purinePerHg: number }[] }
        const estimates = parsed.estimates ?? []

        // Re-enrich unmatched ingredients using AI fallback values
        enrichedFinal = await enrichIngredientsWithDbData(
          extracted as AiExtractedIngredient[],
          estimates
        )
      } catch {
        // Keep original enriched (purinePerHg = 0 for unmatched)
        console.warn('[AI Meal] AI fallback parse failed, keeping 0-purine for unmatched')
      }
    }
  }

  const totalPurineMg = enrichedFinal.reduce((sum, i) => sum + i.purineActual, 0)
  const overallRiskLevel = classifyMealRiskLevel(totalPurineMg)

  console.log(`[AI Meal] Step 2 complete. Total purine: ${totalPurineMg.toFixed(1)} mg (${overallRiskLevel})`)

  // ── Step 3: AI generates recommendations ─────────────────
  const recPrompt = buildRecommendationPrompt(
    extractedMenuName,
    menuNameEn,
    totalPurineMg,
    enrichedFinal
  )

  const recCompletion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: recPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.4,
    max_tokens: 1200,
  })

  const rawRec = recCompletion.choices[0]?.message?.content
  if (!rawRec) throw new Error('ไม่ได้รับผลลัพธ์จาก AI (step 3)')

  let recParsed: unknown
  try {
    recParsed = JSON.parse(rawRec)
  } catch {
    throw new Error('ผลลัพธ์ step 3 จาก AI ไม่ถูกต้อง (JSON parse error)')
  }

  const recValidated = RecommendationResultSchema.safeParse(recParsed)
  if (!recValidated.success) {
    console.error('[AI Meal Service] Step 3 schema error:', recValidated.error.flatten())
    throw new Error('ผลลัพธ์ step 3 ไม่ตรงตาม schema')
  }

  // ── Assemble final result ─────────────────────────────────
  const finalResult = {
    menuName: extractedMenuName,
    menuNameEn,
    totalPurineMg,
    riskLevel: overallRiskLevel,
    ingredients: enrichedFinal.map((ing) => ({
      name: ing.name,
      estimatedGrams: ing.estimatedGrams,
      purinePerHg: ing.purinePerHg,
      purineActual: ing.purineActual,
      riskLevel: ing.riskLevel,
      fromDatabase: ing.fromDatabase,
      matchedFoodName: ing.matchedFoodName,
    })),
    recommendations: recValidated.data.recommendations,
    alternatives: recValidated.data.alternatives,
    disclaimer: recValidated.data.disclaimer,
  }

  // Validate the complete result against the main schema
  const validated = AiMealAnalysisSchema.safeParse(finalResult)
  if (!validated.success) {
    console.error('[AI Meal Service] Final schema validation failed:', validated.error.flatten())
    throw new Error('ผลลัพธ์สุดท้ายไม่ตรงตาม schema ที่กำหนด')
  }

  return validated.data
}
