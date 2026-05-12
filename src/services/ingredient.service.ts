import { prisma } from '@/lib/prisma'
import { FoodCategory, Prisma } from '@prisma/client'

import { generateSearchVariations } from '@/lib/search-utils'

export interface GetIngredientsOptions {
  search?: string
  category?: FoodCategory
  limit?: number
  page?: number
}

/**
 * Service for fetching ingredients from the database.
 */
export const ingredientService = {
  /**
   * Get a list of ingredients with optional search, category filter, and pagination
   */
  async getIngredients(options: GetIngredientsOptions = {}) {
    const { search, category, limit = 50, page = 1 } = options
    const skip = (page - 1) * limit

    const where: Prisma.FoodWhereInput = {}

    if (search) {
      const variations = generateSearchVariations(search)
      
      if (variations.length > 0) {
        where.OR = variations.flatMap(term => [
          { nameTh: { contains: term, mode: 'insensitive' } },
          { nameEn: { contains: term, mode: 'insensitive' } },
          { aliases: { hasSome: [term] } },
        ])
      } else {
        // Fallback to basic if variations is empty
        where.OR = [
          { nameTh: { contains: search, mode: 'insensitive' } },
          { nameEn: { contains: search, mode: 'insensitive' } },
          { aliases: { hasSome: [search] } },
        ]
      }
    }

    if (category) {
      where.category = category
    }

    const [items, totalCount] = await Promise.all([
      prisma.food.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nameTh: 'asc' },
      }),
      prisma.food.count({ where }),
    ])

    return {
      items,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    }
  },

  /**
   * Get a single ingredient by ID
   */
  async getIngredientById(id: string) {
    return prisma.food.findUnique({
      where: { id },
    })
  },
}
