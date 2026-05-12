import { openai } from '@/lib/openai'
import { AiMealAnalysis, AiMealAnalysisSchema } from '@/types/ai-meal'

// ============================================================
// System prompt for the AI model
// ============================================================

const SYSTEM_PROMPT = `คุณเป็นผู้เชี่ยวชาญด้านโภชนาการคลินิกสำหรับผู้ป่วยโรคเกาต์ในประเทศไทย
มีความรู้เชี่ยวชาญเกี่ยวกับปริมาณพิวรีนในอาหารไทยและอาหารทั่วไป

เมื่อผู้ใช้ระบุชื่อเมนูอาหาร ให้วิเคราะห์และตอบกลับเป็น JSON ตาม schema ดังนี้:

{
  "menuName": "ชื่อเมนูภาษาไทย",
  "menuNameEn": "ชื่อเมนูภาษาอังกฤษ",
  "totalPurineMg": ค่าพิวรีนรวมทั้งหมดในมื้อ (ตัวเลข mg),
  "riskLevel": "LOW" หรือ "MODERATE" หรือ "HIGH" หรือ "VERY_HIGH",
  "ingredients": [
    {
      "name": "ชื่อส่วนประกอบ",
      "estimatedGrams": ปริมาณโดยประมาณ (g),
      "purinePerHg": ค่าพิวรีนต่อ 100g (mg),
      "purineActual": ค่าพิวรีนจริงจากปริมาณที่ใช้ (mg),
      "riskLevel": "LOW" หรือ "MODERATE" หรือ "HIGH" หรือ "VERY_HIGH"
    }
  ],
  "recommendations": [
    {
      "title": "หัวข้อคำแนะนำ",
      "message": "รายละเอียดคำแนะนำสำหรับผู้ป่วยเกาต์",
      "type": "success" หรือ "warning" หรือ "danger" หรือ "info"
    }
  ],
  "alternatives": [
    {
      "menuName": "ชื่อเมนูทดแทน",
      "reason": "เหตุผลที่เหมาะสมกว่า",
      "estimatedPurine": ค่าพิวรีนโดยประมาณ (mg)
    }
  ],
  "disclaimer": "ข้อความ disclaimer สั้นๆ เกี่ยวกับความถูกต้องของข้อมูล"
}

กฎในการคำนวณ:
- LOW = ต่ำกว่า 50 mg/100g หรือรวมมื้อต่ำกว่า 100mg
- MODERATE = 50-150 mg/100g หรือรวมมื้อ 100-200mg  
- HIGH = 150-300 mg/100g หรือรวมมื้อ 200-400mg
- VERY_HIGH = มากกว่า 300 mg/100g หรือรวมมื้อมากกว่า 400mg

ข้อกำหนดในการตอบ:
- ต้องตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น
- ใช้ภาษาไทยสำหรับ name, title, message, reason
- ประมาณการส่วนประกอบตามปริมาณมาตรฐานของเมนูไทย (1 จาน/1 ชาม)
- ให้ recommendations อย่างน้อย 2-3 ข้อ ที่เป็นประโยชน์จริงๆ
- ให้ alternatives อย่างน้อย 2 เมนูที่มีพิวรีนต่ำกว่า
- disclaimer ควรเน้นว่าเป็นการประมาณการ ไม่ใช่ค่าแน่นอน`

// ============================================================
// Main AI analysis function
// ============================================================

/**
 * Analyzes a Thai dish name using OpenAI to estimate purine content
 * and generate dietary recommendations for gout patients.
 */
export async function analyzeMeal(menuName: string): Promise<AiMealAnalysis> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: `วิเคราะห์เมนูอาหารนี้สำหรับผู้ป่วยโรคเกาต์: "${menuName}"`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3, // Lower temperature for more consistent, factual responses
    max_tokens: 2000,
  })

  const rawContent = completion.choices[0]?.message?.content

  if (!rawContent) {
    throw new Error('ไม่ได้รับผลลัพธ์จาก AI')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(rawContent)
  } catch {
    throw new Error('ผลลัพธ์จาก AI ไม่ถูกต้อง (JSON parse error)')
  }

  // Validate against our schema
  const validated = AiMealAnalysisSchema.safeParse(parsed)
  if (!validated.success) {
    console.error('[AI Meal Service] Schema validation failed:', validated.error.flatten())
    throw new Error('ผลลัพธ์จาก AI ไม่ตรงตาม schema ที่กำหนด')
  }

  return validated.data
}
