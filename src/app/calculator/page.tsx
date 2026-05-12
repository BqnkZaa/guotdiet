import type { Metadata } from 'next'
import { Calculator } from 'lucide-react'
import { MealBuilder } from '@/components/features/meal-calculator/meal-builder'

export const metadata: Metadata = {
  title: 'คำนวณพิวรีนในมื้ออาหาร',
  description: 'คำนวณปริมาณพิวรีนในมื้ออาหารของคุณแบบเรียลไทม์ พร้อมคำแนะนำ',
}

export default function CalculatorPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Calculator className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">คำนวณพิวรีน</h1>
          <p className="text-sm text-muted-foreground">ลองคำนวณพิวรีนก่อนรับประทานจริง</p>
        </div>
      </div>

      {/* Main Feature */}
      <MealBuilder />
    </div>
  )
}
