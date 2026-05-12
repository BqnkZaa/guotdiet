'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { FoodCategory, PurineLevel } from '@prisma/client'
import { normalizeThaiText, generateSearchVariations } from '@/lib/search-utils'
import { isAuthenticated } from './manage'

export type CreateFoodState = {
  success: boolean
  message: string
}

export async function createFoodAction(prevState: CreateFoodState, formData: FormData): Promise<CreateFoodState> {
  try {
    const isAuth = await isAuthenticated()
    if (!isAuth) return { success: false, message: 'Unauthorized' }

    const nameTh = formData.get('nameTh') as string
    const nameEn = formData.get('nameEn') as string
    const category = formData.get('category') as FoodCategory
    const purineLevel = formData.get('purineLevel') as PurineLevel
    const purinePerHg = parseFloat(formData.get('purinePerHg') as string)
    const aliasesRaw = formData.get('aliases') as string
    
    if (!nameTh || !nameEn || !category || !purineLevel || isNaN(purinePerHg)) {
      return { success: false, message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' }
    }

    const existing = await prisma.food.findFirst({
      where: { nameTh: { equals: nameTh, mode: 'insensitive' } }
    })

    if (existing) {
      return { success: false, message: `มีวัตถุดิบชื่อ "${nameTh}" อยู่ในระบบแล้ว` }
    }

    let aliases: string[] = []
    if (aliasesRaw) {
      aliases = aliasesRaw.split(',').map(a => a.trim()).filter(a => a.length > 0)
    }

    const autoAliases = generateSearchVariations(nameTh)
    const combinedAliases = Array.from(new Set([...aliases, ...autoAliases]))

    await prisma.food.create({
      data: {
        nameTh,
        nameEn,
        category,
        purineLevel,
        purinePerHg,
        aliases: combinedAliases,
        isVerified: true,
      }
    })

    revalidatePath('/foods')
    revalidatePath('/calculator')
    revalidatePath('/manage')

    return { success: true, message: 'เพิ่มวัตถุดิบสำเร็จ' }
  } catch (error: any) {
    console.error('Error creating food:', error)
    return { success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง' }
  }
}

export async function deleteFoodAction(id: string) {
  try {
    const isAuth = await isAuthenticated()
    if (!isAuth) throw new Error('Unauthorized')

    await prisma.food.delete({ where: { id } })
    revalidatePath('/foods')
    revalidatePath('/calculator')
    revalidatePath('/manage')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
