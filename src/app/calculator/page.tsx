import type { Metadata } from 'next'
import { Calculator } from 'lucide-react'
import { MealBuilder } from '@/components/features/meal-calculator/meal-builder'

export const metadata: Metadata = {
  title: 'คำนวณพิวรีนในมื้ออาหาร',
  description: 'คำนวณปริมาณพิวรีนในมื้ออาหารของคุณแบบเรียลไทม์ พร้อมคำแนะนำ',
}

export default function CalculatorPage() {
  return (
    <div className="container mx-auto px-4 pt-8 pb-12 space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 border-border/40">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shadow-inner border border-primary/20">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Gout Diet Analysis Tool</h1>
            <p className="text-sm text-muted-foreground mt-1">เครื่องมือคำนวณและวิเคราะห์ปริมาณพิวรีนในมื้ออาหารทางคลินิก</p>
          </div>
        </div>
      </div>

      {/* Main Feature */}
      <MealBuilder />
    </div>
  )
}
