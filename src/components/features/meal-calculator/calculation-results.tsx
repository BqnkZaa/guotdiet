'use client'

import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  let statusText = 'SAFE / Normal Level'
  if (totalPurineMg > 300) {
    progressColor = 'bg-red-500'
    statusText = 'HIGH RISK / Exceeds Limit'
  } else if (totalPurineMg > 150) {
    progressColor = 'bg-orange-500'
    statusText = 'WARNING / Elevated Level'
  }

  return (
    <div className="space-y-8">
      {/* Primary Result Card */}
      <Card className="border-border/60 shadow-sm overflow-hidden rounded-2xl">
        <div className="bg-muted/20 border-b px-8 py-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Clinical Analysis</h3>
        </div>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">Total Purine Load</span>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-bold tracking-tighter text-foreground">
                {totalPurineMg.toFixed(1)}
              </span>
              <span className="text-xl text-muted-foreground font-medium ml-1">mg</span>
            </div>
            <Badge variant="outline" className={`mt-3 ${totalPurineMg > 300 ? 'text-red-500 border-red-200 bg-red-50' : totalPurineMg > 150 ? 'text-orange-500 border-orange-200 bg-orange-50' : 'text-green-600 border-green-200 bg-green-50'}`}>
              {statusText}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <span>0 mg</span>
              <span>Daily Max (400mg)</span>
            </div>
            <Progress 
              value={percentage} 
              className="h-4 bg-muted/50 overflow-hidden" 
              indicatorClassName={`${progressColor} transition-all duration-1000 ease-out`} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card className="border-border/60 shadow-sm overflow-hidden rounded-2xl">
          <div className="bg-muted/20 border-b px-8 py-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Medical Recommendations</h3>
          </div>
          <CardContent className="p-8">
            <div className="space-y-6">
              {recommendations.map((rec, i) => (
                <div 
                  key={i} 
                  className={`flex gap-4 rounded-xl border p-5 transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-right-4`}
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
                >
                  <div className="shrink-0 mt-0.5">
                    {getIcon(rec.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-base text-foreground mb-1.5 tracking-tight">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {rec.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
