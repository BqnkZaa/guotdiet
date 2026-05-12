'use client'

import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Utensils,
} from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AiMealAnalysis, AiRecommendation } from '@/types/ai-meal'

interface AiResultDisplayProps {
  result: AiMealAnalysis
}

const DAILY_MAX_PURINE = 400

const riskConfig = {
  LOW: {
    label: 'ปลอดภัย',
    labelEn: 'SAFE',
    color: 'text-green-600 dark:text-green-400',
    badge: 'border-green-200 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400',
    progress: 'bg-green-500',
  },
  MODERATE: {
    label: 'ระมัดระวัง',
    labelEn: 'MODERATE',
    color: 'text-yellow-600 dark:text-yellow-400',
    badge: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
    progress: 'bg-yellow-500',
  },
  HIGH: {
    label: 'ระดับสูง',
    labelEn: 'HIGH RISK',
    color: 'text-orange-600 dark:text-orange-400',
    badge: 'border-orange-200 bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400',
    progress: 'bg-orange-500',
  },
  VERY_HIGH: {
    label: 'อันตราย',
    labelEn: 'VERY HIGH RISK',
    color: 'text-red-600 dark:text-red-400',
    badge: 'border-red-200 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
    progress: 'bg-red-500',
  },
}

const recIconMap = {
  danger: <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />,
  warning: <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />,
  success: <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />,
  info: <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />,
}

const recBgMap = {
  danger: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40',
  warning: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/40',
  success: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/40',
  info: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40',
}

const ingRiskBadge = {
  LOW: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  MODERATE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  VERY_HIGH: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export function AiResultDisplay({ result }: AiResultDisplayProps) {
  const [showIngredients, setShowIngredients] = useState(true)
  const risk = riskConfig[result.riskLevel]
  const percentage = Math.min((result.totalPurineMg / DAILY_MAX_PURINE) * 100, 100)

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Header Card ─────────────────────────────────────── */}
      <Card className="border-border/60 shadow-sm overflow-hidden rounded-2xl">
        <div className="bg-muted/20 border-b px-6 py-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            AI Analysis Result
          </h3>
        </div>
        <CardContent className="p-6">
          {/* Menu Name */}
          <div className="mb-5">
            <p className="text-xs text-muted-foreground mb-1">{result.menuNameEn}</p>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">{result.menuName}</h2>
          </div>

          {/* Purine Score */}
          <div className="flex flex-col items-center justify-center py-4 mb-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Total Purine Load
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-bold tracking-tighter text-foreground">
                {result.totalPurineMg.toFixed(1)}
              </span>
              <span className="text-xl text-muted-foreground font-medium ml-1">mg</span>
            </div>
            <Badge
              variant="outline"
              className={`mt-3 text-sm font-semibold px-4 py-1 border ${risk.badge}`}
            >
              {risk.labelEn} — {risk.label}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <span>0 mg</span>
              <span>โควตาต่อวัน ({DAILY_MAX_PURINE} mg)</span>
            </div>
            <Progress
              value={percentage}
              className="h-3 bg-muted/50 overflow-hidden"
              indicatorClassName={`${risk.progress} transition-all duration-1000 ease-out`}
            />
            <p className="text-xs text-muted-foreground text-right">
              ใช้ไป {percentage.toFixed(0)}% ของโควตาต่อวัน
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Ingredients Table ────────────────────────────────── */}
      <Card className="border-border/60 shadow-sm overflow-hidden rounded-2xl">
        <button
          type="button"
          className="w-full bg-muted/20 border-b px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
          onClick={() => setShowIngredients((v) => !v)}
          aria-expanded={showIngredients}
          aria-controls="ingredients-panel"
        >
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              ส่วนประกอบโดยประมาณ
            </h3>
            <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-background border shadow-sm">
              {result.ingredients.length} รายการ
            </Badge>
          </div>
          {showIngredients ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {showIngredients && (
          <div id="ingredients-panel" className="divide-y divide-border/40">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-6 py-2 bg-muted/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="col-span-4">วัตถุดิบ</span>
              <span className="col-span-2 text-right">ปริมาณ</span>
              <span className="col-span-3 text-right">พิวรีน/100g</span>
              <span className="col-span-3 text-right">พิวรีนรวม</span>
            </div>
            {result.ingredients.map((ing, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-2 px-6 py-3 items-center hover:bg-accent/5 animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
              >
                <div className="col-span-4 flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground leading-tight">{ing.name}</span>
                </div>
                <span className="col-span-2 text-right text-sm text-muted-foreground">
                  {ing.estimatedGrams}g
                </span>
                <span className="col-span-3 text-right text-sm text-muted-foreground">
                  {ing.purinePerHg} mg
                </span>
                <div className="col-span-3 flex items-center justify-end gap-2">
                  <span className="font-semibold text-sm text-foreground">
                    {ing.purineActual.toFixed(1)} mg
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${ingRiskBadge[ing.riskLevel]}`}
                  >
                    {ing.riskLevel === 'VERY_HIGH'
                      ? '🔴'
                      : ing.riskLevel === 'HIGH'
                        ? '🟠'
                        : ing.riskLevel === 'MODERATE'
                          ? '🟡'
                          : '🟢'}
                  </span>
                </div>
              </div>
            ))}
            {/* Total row */}
            <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-muted/20 font-semibold">
              <span className="col-span-9 text-sm text-foreground">รวมทั้งหมด</span>
              <span className="col-span-3 text-right text-sm font-bold text-foreground">
                {result.totalPurineMg.toFixed(1)} mg
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* ── Recommendations ──────────────────────────────────── */}
      {result.recommendations.length > 0 && (
        <Card className="border-border/60 shadow-sm overflow-hidden rounded-2xl">
          <div className="bg-muted/20 border-b px-6 py-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              คำแนะนำทางโภชนาการ
            </h3>
          </div>
          <CardContent className="p-5 space-y-3">
            {result.recommendations.map((rec: AiRecommendation, i) => (
              <div
                key={i}
                className={`flex gap-3 rounded-xl border p-4 animate-in fade-in slide-in-from-right-4 duration-300 ${recBgMap[rec.type]}`}
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
              >
                {recIconMap[rec.type]}
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-1">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rec.message}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ── Alternatives ─────────────────────────────────────── */}
      {result.alternatives.length > 0 && (
        <Card className="border-border/60 shadow-sm overflow-hidden rounded-2xl">
          <div className="bg-muted/20 border-b px-6 py-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              เมนูทดแทนที่เหมาะสมกว่า
            </h3>
          </div>
          <div className="divide-y divide-border/40">
            {result.alternatives.map((alt, i) => (
              <div
                key={i}
                className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-accent/5 animate-in fade-in slide-in-from-left-4 duration-300"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
              >
                <div>
                  <p className="font-semibold text-sm text-foreground">{alt.menuName}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{alt.reason}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    ~{alt.estimatedPurine} mg
                  </span>
                  <p className="text-xs text-muted-foreground">พิวรีน</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Disclaimer ───────────────────────────────────────── */}
      <p className="text-xs text-muted-foreground/60 text-center leading-relaxed px-4 pb-2">
        ⚠️ {result.disclaimer}
      </p>
    </div>
  )
}
