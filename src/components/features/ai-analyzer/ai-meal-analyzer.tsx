'use client'

import { useState } from 'react'
import { Loader2, Sparkles, Search, RotateCcw, BotMessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AiResultDisplay } from './ai-result-display'
import { AiMealAnalysis, AnalyzeMealResponse } from '@/types/ai-meal'

// Example menus to help users get started
const EXAMPLE_MENUS = [
  'ข้าวมันไก่',
  'ส้มตำปูปลาร้า',
  'สุกี้ยากี้',
  'ต้มยำกุ้ง',
  'ผัดกะเพรา',
  'ข้าวผัดหมู',
]

export function AiMealAnalyzer() {
  const [menuInput, setMenuInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AiMealAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (menuName?: string) => {
    const target = (menuName ?? menuInput).trim()
    if (!target) {
      toast.warning('กรุณาระบุชื่อเมนูอาหาร')
      return
    }

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch('/api/ai/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuName: target }),
      })

      const data: AnalyzeMealResponse = await res.json()

      if (!data.success || !data.data) {
        throw new Error(data.error ?? 'เกิดข้อผิดพลาดในการวิเคราะห์')
      }

      setResult(data.data)
      if (menuName) setMenuInput(menuName)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setMenuInput('')
    setResult(null)
    setError(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) handleAnalyze()
  }

  return (
    <div className="space-y-6">
      {/* ── Input Section ─────────────────────────────────────── */}
      <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
        <div className="bg-muted/20 border-b px-8 py-5 flex items-center gap-2">
          <BotMessageSquare className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            AI Meal Analyzer
          </h3>
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-primary/60 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full">
            Powered by GPT-4o mini
          </span>
        </div>
        <CardContent className="p-8 space-y-6">
          {/* Input row */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="ai-menu-input"
                value={menuInput}
                onChange={(e) => setMenuInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="พิมพ์ชื่อเมนูอาหาร เช่น ข้าวมันไก่, ส้มตำ, ต้มยำกุ้ง..."
                className="pl-10 h-12 text-base bg-accent/20 border-accent/40 focus-visible:bg-transparent focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40 rounded-xl transition-all shadow-none"
                disabled={loading}
                aria-label="ชื่อเมนูอาหาร"
              />
            </div>
            <Button
              id="ai-analyze-btn"
              onClick={() => handleAnalyze()}
              disabled={loading || !menuInput.trim()}
              className="h-12 px-6 rounded-xl font-semibold text-sm gap-2 gradient-brand text-white shadow-md shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
              aria-label="วิเคราะห์เมนู"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? 'กำลังวิเคราะห์...' : 'วิเคราะห์'}
            </Button>
          </div>

          {/* Example chips */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground mr-1 shrink-0">ตัวอย่าง:</span>
            {EXAMPLE_MENUS.map((menu) => (
              <button
                key={menu}
                type="button"
                id={`example-menu-${menu}`}
                onClick={() => handleAnalyze(menu)}
                disabled={loading}
                className="text-xs font-medium px-3 py-1.5 rounded-full border border-border/60 bg-background hover:bg-accent hover:border-primary/30 transition-all duration-150 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {menu}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Loading State ─────────────────────────────────────── */}
      {loading && (
        <Card className="border-border/40 bg-muted/5 shadow-sm overflow-hidden rounded-2xl animate-in fade-in zoom-in-95 duration-400">
          <CardContent className="flex flex-col items-center justify-center p-16 text-center gap-6">
            <div className="relative h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-30" />
              <Sparkles className="h-8 w-8 text-primary/50 animate-pulse relative z-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">AI กำลังวิเคราะห์เมนู</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                กำลังประมาณส่วนประกอบ ค่าพิวรีน และจัดเตรียมคำแนะนำ...
              </p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-2 w-2 rounded-full bg-primary/40 animate-bounce"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Error State ───────────────────────────────────────── */}
      {error && !loading && (
        <Card className="border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 shadow-sm rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
              <span className="text-lg">⚠️</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">เกิดข้อผิดพลาด</h4>
              <p className="text-sm text-red-600/80 dark:text-red-400/70">{error}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="shrink-0 text-muted-foreground">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Results ───────────────────────────────────────────── */}
      {result && !loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              ผลวิเคราะห์สำหรับ{' '}
              <span className="font-semibold text-foreground">&ldquo;{result.menuName}&rdquo;</span>
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs text-muted-foreground gap-1.5"
            >
              <RotateCcw className="h-3 w-3" />
              วิเคราะห์เมนูใหม่
            </Button>
          </div>
          <AiResultDisplay result={result} />
        </div>
      )}

      {/* ── Empty State ───────────────────────────────────────── */}
      {!result && !loading && !error && (
        <Card className="border-border/40 bg-muted/5 shadow-sm overflow-hidden rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center p-16 text-center gap-5">
            <div className="relative h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20 duration-3000" />
              <BotMessageSquare className="h-9 w-9 text-primary/40 relative z-10" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground tracking-tight">
                AI Meal Analysis
              </h3>
              <p className="text-sm mt-2 max-w-[300px] text-muted-foreground leading-relaxed">
                พิมพ์ชื่อเมนูอาหารไทยหรืออาหารทั่วไป AI จะวิเคราะห์ส่วนประกอบและค่าพิวรีนให้อัตโนมัติ
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
