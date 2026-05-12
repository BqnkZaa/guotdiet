'use client'

import { useState, useMemo } from 'react'
import { Trash2, Scale } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FoodSelector, FoodItem } from './food-selector'
import { CalculationResults } from './calculation-results'
import { calculateTotalPurine, generateMealRecommendations, MealItemInput } from '@/services/purine.service'

export function MealBuilder() {
  const [items, setItems] = useState<MealItemInput[]>([])

  const handleAddFood = (food: FoodItem) => {
    // Check if already exists
    if (items.find(i => i.foodId === food.id)) {
      toast.info(`มี ${food.nameTh} ในรายการแล้ว`)
      return
    }

    setItems([
      ...items,
      {
        foodId: food.id,
        name: food.nameTh,
        purinePerHg: food.purinePerHg,
        amountGrams: 100, // default 100g
        category: food.category,
      }
    ])
  }

  const handleRemoveFood = (foodId: string) => {
    setItems(items.filter(i => i.foodId !== foodId))
  }

  const handleUpdateAmount = (foodId: string, amount: string) => {
    const val = parseFloat(amount)
    setItems(items.map(i => i.foodId === foodId ? { ...i, amountGrams: isNaN(val) ? 0 : val } : i))
  }

  const totalPurineMg = useMemo(() => calculateTotalPurine(items), [items])
  const recommendations = useMemo(() => generateMealRecommendations(totalPurineMg, items), [totalPurineMg, items])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left side: Input Form */}
      <div className="lg:col-span-7 space-y-6">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-lg">ค้นหาและเพิ่มอาหาร</CardTitle>
          </CardHeader>
          <CardContent>
            <FoodSelector onSelect={handleAddFood} />
          </CardContent>
        </Card>

        {items.length > 0 && (
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">รายการอาหารในมื้อนี้</CardTitle>
              <Badge variant="secondary">{items.length} รายการ</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                  {items.map((item) => {
                  const itemPurine = (item.amountGrams / 100) * item.purinePerHg
                  return (
                    <div key={item.foodId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border bg-card hover:border-primary/40 transition-colors shadow-sm">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-foreground leading-tight">{item.name}</h4>
                        <p className="text-base text-muted-foreground mt-1">
                          {item.purinePerHg} mg / 100g
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-border/50">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              step="10"
                              value={item.amountGrams || ''}
                              onChange={(e) => handleUpdateAmount(item.foodId, e.target.value)}
                              className="w-28 h-12 pr-10 text-right text-lg font-medium"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-muted-foreground pointer-events-none">
                              g
                            </span>
                          </div>
                        </div>

                        <div className="w-24 text-right shrink-0">
                          <span className="text-lg font-bold text-primary">
                            {itemPurine.toFixed(1)} mg
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFood(item.foodId)}
                          className="text-muted-foreground hover:text-destructive shrink-0 h-12 w-12 rounded-full"
                          aria-label="ลบรายการ"
                        >
                          <Trash2 className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right side: Results */}
      <div className="lg:col-span-5">
        <div className="sticky top-24">
          {items.length > 0 ? (
            <CalculationResults 
              totalPurineMg={totalPurineMg} 
              recommendations={recommendations}
            />
          ) : (
            <Card className="border-border/60 bg-muted/30 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                <div className="h-16 w-16 rounded-full bg-background flex items-center justify-center mb-6 shadow-sm border border-border/50">
                  <Scale className="h-8 w-8 text-primary/60" />
                </div>
                <p className="text-lg font-semibold text-foreground">ยังไม่มีรายการอาหาร</p>
                <p className="text-base mt-2 max-w-[250px]">
                  ค้นหาและเลือกวัตถุดิบทางด้านซ้ายเพื่อดูผลการคำนวณพิวรีนในมื้อนี้
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
