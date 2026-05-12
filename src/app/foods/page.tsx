import type { Metadata } from 'next'
import { Salad, ServerCrash } from 'lucide-react'
import { ingredientService } from '@/services/ingredient.service'
import { Badge } from '@/components/ui/badge'
import { FoodCategory, PurineLevel, Food } from '@prisma/client'

export const metadata: Metadata = {
  title: 'ฐานข้อมูลอาหาร',
  description: 'ค้นหาปริมาณพิวรีนในวัตถุดิบและอาหารต่างๆ',
}

// Map enum to Thai strings
const categoryMap: Record<FoodCategory, string> = {
  MEAT: 'เนื้อสัตว์',
  SEAFOOD: 'อาหารทะเล',
  POULTRY: 'สัตว์ปีก',
  ORGAN_MEAT: 'เครื่องใน',
  LEGUMES: 'ถั่ว',
  VEGETABLES: 'ผัก',
  FRUITS: 'ผลไม้',
  GRAINS: 'ธัญพืช',
  DAIRY: 'นม/ผลิตภัณฑ์นม',
  BEVERAGES: 'เครื่องดื่ม',
  OTHER: 'อื่นๆ',
}

const levelColors: Record<PurineLevel, string> = {
  VERY_HIGH: 'bg-red-100 text-red-700 border-red-200',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
  MODERATE: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  LOW: 'bg-green-100 text-green-700 border-green-200',
}

export default async function FoodsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const sp = await searchParams
  const q = sp.q || ''
  const page = Number(sp.page) || 1

  // Gracefully handle DB connection errors instead of crashing the page
  let items: Food[] = []
  let totalCount = 0
  let dbError = false

  try {
    const result = await ingredientService.getIngredients({
      search: q,
      page,
      limit: 100,
    })
    items = result.items
    totalCount = result.totalCount
  } catch (err) {
    console.error('[FoodsPage] Failed to fetch ingredients:', err)
    dbError = true
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-12">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Salad className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">ฐานข้อมูลอาหาร</h1>
            <p className="text-sm text-muted-foreground">
              {dbError ? 'ไม่สามารถโหลดข้อมูลได้' : `รายการวัตถุดิบ ${totalCount} รายการ`}
            </p>
          </div>
        </div>
      </div>

      {/* DB Error State */}
      {dbError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <ServerCrash className="h-12 w-12 text-muted-foreground/50" />
          <div>
            <p className="font-semibold text-foreground">ไม่สามารถเชื่อมต่อฐานข้อมูลได้</p>
            <p className="text-sm text-muted-foreground mt-1">
              กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Simple Search Form */}
          <form className="flex gap-2 max-w-md mb-6">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="ค้นหาวัตถุดิบ..."
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              ค้นหา
            </button>
          </form>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((food: Food) => (
              <div
                key={food.id}
                className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{food.nameTh}</h3>
                    <p className="text-xs text-muted-foreground">{food.nameEn}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs px-2 py-0.5 border ${levelColors[food.purineLevel as PurineLevel]}`}
                  >
                    {food.purineLevel}
                  </Badge>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{categoryMap[food.category]}</span>
                  <span className="font-medium text-foreground">{food.purinePerHg} mg / 100g</span>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                ไม่พบรายการอาหารที่ค้นหา
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
