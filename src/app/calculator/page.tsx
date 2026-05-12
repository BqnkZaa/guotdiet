'use client'

import { useState } from 'react'
import { Calculator, Sparkles } from 'lucide-react'
import { MealBuilder } from '@/components/features/meal-calculator/meal-builder'
import { AiMealAnalyzer } from '@/components/features/ai-analyzer/ai-meal-analyzer'

type Tab = 'manual' | 'ai'

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<Tab>('manual')

  return (
    <div className="container mx-auto px-4 pt-8 pb-12 space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 border-border/40">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shadow-inner border border-primary/20">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Gout Diet Analysis Tool
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              เครื่องมือคำนวณและวิเคราะห์ปริมาณพิวรีนในมื้ออาหารทางคลินิก
            </p>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted/40 border border-border/40 w-fit">
        <button
          id="tab-manual-calculator"
          type="button"
          onClick={() => setActiveTab('manual')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === 'manual'
              ? 'bg-background text-foreground shadow-sm border border-border/60'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
          }`}
          aria-selected={activeTab === 'manual'}
          role="tab"
        >
          <Calculator className="h-4 w-4" />
          เครื่องมือคำนวณ
        </button>
        <button
          id="tab-ai-analyzer"
          type="button"
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === 'ai'
              ? 'bg-background text-foreground shadow-sm border border-border/60'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
          }`}
          aria-selected={activeTab === 'ai'}
          role="tab"
        >
          <Sparkles className="h-4 w-4" />
          AI วิเคราะห์เมนู
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'manual' ? <MealBuilder /> : <AiMealAnalyzer />}
    </div>
  )
}
