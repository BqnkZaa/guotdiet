'use client'

import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { RecommendationCard } from '@/services/purine.service'

interface CalculationResultsProps {
  totalPurineMg: number
  recommendations: RecommendationCard[]
}

const getIcon = (type: RecommendationCard['type']) => {
  switch (type) {
    case 'danger':
      return <AlertCircle className="h-5 w-5 text-red-500" />
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-orange-500" />
    case 'success':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />
  }
}

const getBgColor = (type: RecommendationCard['type']) => {
  switch (type) {
    case 'danger':
      return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40'
    case 'warning':
      return 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/40'
    case 'success':
      return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/40'
    case 'info':
      return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40'
  }
}

export function CalculationResults({ totalPurineMg, recommendations }: CalculationResultsProps) {
  // Assuming 400mg is the daily max for visualization
  const percentage = Math.min((totalPurineMg / 400) * 100, 100)
  
  let progressColor = 'bg-green-500'
  if (totalPurineMg > 300) progressColor = 'bg-red-500'
  else if (totalPurineMg > 150) progressColor = 'bg-orange-500'

  return (
    <div className="space-y-6">
      {/* Primary Result Card */}
      <Card className="border-border/60 shadow-md">
        <CardHeader className="pb-3 text-center">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
            พิวรีนรวมในมื้อนี้
          </CardTitle>
          <div className="flex items-baseline justify-center gap-1 mt-2">
            <span className="text-5xl font-bold tracking-tight text-foreground">
              {totalPurineMg.toFixed(1)}
            </span>
            <span className="text-muted-foreground font-medium">mg</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress 
              value={percentage} 
              className="h-3" 
              indicatorClassName={progressColor} 
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 mg</span>
              <span>Daily Limit (400 mg)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground px-1">ข้อแนะนำทางการแพทย์</h3>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div 
                key={i} 
                className={`flex gap-3 rounded-lg border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${getBgColor(rec.type)}`}
              >
                <div className="shrink-0 mt-0.5">
                  {getIcon(rec.type)}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-1">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {rec.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
