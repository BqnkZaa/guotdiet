import { NextRequest, NextResponse } from 'next/server'
import { analyzeMeal } from '@/services/ai-meal.service'
import { AnalyzeMealRequestSchema, AnalyzeMealResponse } from '@/types/ai-meal'

export async function POST(req: NextRequest): Promise<NextResponse<AnalyzeMealResponse>> {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'ยังไม่ได้ตั้งค่า OPENAI_API_KEY กรุณาติดต่อผู้ดูแลระบบ' },
        { status: 503 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const parsed = AnalyzeMealRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    const { menuName } = parsed.data

    // Call AI service
    const analysis = await analyzeMeal(menuName)

    return NextResponse.json({ success: true, data: analysis })
  } catch (error) {
    console.error('[AI_ANALYZE_MEAL]', error)

    // Handle OpenAI-specific errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { success: false, error: 'API key ไม่ถูกต้อง กรุณาติดต่อผู้ดูแลระบบ' },
          { status: 401 }
        )
      }
      if (error.message.includes('rate limit') || error.message.includes('quota')) {
        return NextResponse.json(
          { success: false, error: 'ใช้งาน AI เกินขีดจำกัด กรุณาลองใหม่ในภายหลัง' },
          { status: 429 }
        )
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดภายในระบบ' },
      { status: 500 }
    )
  }
}
