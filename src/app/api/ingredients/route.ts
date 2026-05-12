import { NextRequest, NextResponse } from 'next/server'
import { ingredientService } from '@/services/ingredient.service'
import { FoodCategory } from '@prisma/client'
import { z } from 'zod'

const searchSchema = z.object({
  search: z.string().optional(),
  category: z.nativeEnum(FoodCategory).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
})

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const query = {
      search: searchParams.get('q') || undefined,
      category: searchParams.get('category') as FoodCategory | undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    }

    const parsed = searchSchema.parse(query)

    const result = await ingredientService.getIngredients({
      search: parsed.search,
      category: parsed.category,
      page: parsed.page,
      limit: parsed.limit,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('[INGREDIENTS_GET]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid query parameters' }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
