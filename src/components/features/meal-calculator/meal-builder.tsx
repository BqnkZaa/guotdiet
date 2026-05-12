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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Left side: Input Form */}
      <div className="lg:col-span-7 space-y-8">
        <Card className="border-border/60 shadow-sm rounded-2xl overflow-visible">
          <CardHeader className="bg-muted/20 border-b px-8 py-5 rounded-t-2xl">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Add Ingredients</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="relative z-50">
              <FoodSelector onSelect={handleAddFood} />
            </div>
          </CardContent>
        </Card>

        {items.length > 0 && (
          <Card className="border-border/60 shadow-sm overflow-hidden rounded-2xl">
            <div className="bg-muted/20 border-b px-8 py-5 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dietary Components</h3>
              <Badge variant="secondary" className="bg-background border shadow-sm px-3 py-1 rounded-full text-xs">
                {items.length} Items
              </Badge>
            </div>
            <div className="divide-y divide-border/40">
                {items.map((item, index) => {
                const itemPurine = (item.amountGrams / 100) * item.purinePerHg
                return (
                  <div 
                    key={item.foodId} 
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-8 py-6 bg-card hover:bg-accent/5 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-300"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-base text-foreground leading-tight">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1 font-light">
                        {item.purinePerHg} mg / 100g
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 pt-2 sm:pt-0">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            step="10"
                            value={item.amountGrams || ''}
                            onChange={(e) => handleUpdateAmount(item.foodId, e.target.value)}
                            className="w-24 h-10 pr-8 text-right text-base font-medium bg-transparent border-border/50 focus-visible:ring-1 focus-visible:ring-primary/30"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                            g
                          </span>
                        </div>
                      </div>

                      <div className="w-20 text-right shrink-0">
                        <span className="text-base font-semibold text-foreground/80">
                          {itemPurine.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">mg</span>
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFood(item.foodId)}
                        className="text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 shrink-0 h-10 w-10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                        aria-label="ลบรายการ"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )}
      </div>

      {/* Right side: Results */}
      <div className="lg:col-span-5">
        <div className="sticky top-28">
          {items.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <CalculationResults 
                totalPurineMg={totalPurineMg} 
                recommendations={recommendations}
              />
            </div>
          ) : (
            <Card className="border-border/40 bg-muted/5 shadow-sm overflow-hidden rounded-2xl animate-in fade-in zoom-in-95 duration-500">
              <CardContent className="flex flex-col items-center justify-center p-16 lg:p-24 text-center">
                <div className="relative h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center mb-8 border border-primary/10">
                  <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20 duration-3000"></div>
                  <Scale className="h-10 w-10 text-primary/40 relative z-10" />
                </div>
                <h3 className="text-xl font-semibold text-foreground tracking-tight">Awaiting Input Data</h3>
                <p className="text-base mt-3 max-w-[280px] text-muted-foreground leading-relaxed">
                  Select ingredients from the database to generate a real-time clinical analysis report.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
