import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Leaf,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Disclaimer } from '@/components/shared/disclaimer'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'GoutDiet — ระบบควบคุมอาหารและติดตามกรดยูริก',
  description: siteConfig.description,
}



const purineGuide = [
  {
    level: 'สูงมาก (>300 mg)',
    examples: 'เครื่องใน, ปลาดุก, ปลาอินทรีย์',
    action: 'หลีกเลี่ยง',
    dot: 'bg-red-500',
    text: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800/40',
  },
  {
    level: 'สูง (150-300 mg)',
    examples: 'กุ้ง, ปลาแซลมอน, เนื้อวัว',
    action: 'จำกัดปริมาณ',
    dot: 'bg-orange-500',
    text: 'text-orange-700 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-800/40',
  },
  {
    level: 'ปานกลาง (50-150 mg)',
    examples: 'ไก่, ถั่วเหลือง, ผักโขม',
    action: 'รับประทานได้',
    dot: 'bg-yellow-500',
    text: 'text-yellow-700 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    border: 'border-yellow-200 dark:border-yellow-800/40',
  },
  {
    level: 'ต่ำ (<50 mg)',
    examples: 'ไข่, นม, ผลไม้, ผัก',
    action: 'ปลอดภัย',
    dot: 'bg-green-500',
    text: 'text-green-700 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-800/40',
  },
]



export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="relative overflow-hidden gradient-hero py-20 sm:py-28 lg:py-36">
        {/* Decorative background circles */}
        <div
          className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <Badge
              variant="secondary"
              className="mb-6 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium"
            >
              <Leaf className="h-3 w-3 text-primary" />
              ระบบควบคุมอาหารสำหรับผู้ป่วยโรคเกาต์
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              ควบคุมพิวรีน{' '}
              <span className="relative inline-block">
                <span className="text-primary">ลดกรดยูริก</span>
                <span
                  className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full gradient-brand opacity-40"
                  aria-hidden="true"
                />
              </span>
              <br />
              ด้วยข้อมูลที่แม่นยำ
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed sm:text-xl">
              แพลตฟอร์มช่วยติดตามอาหาร คำนวณปริมาณพิวรีน
              และดูแลระดับกรดยูริกในเลือด — ทั้งหมดในที่เดียว
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                id="hero-cta-register"
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg gradient-brand text-white px-8 py-3 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-all duration-200"
              >
                เริ่มต้นฟรี
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                id="hero-cta-foods"
                href="/foods"
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-background px-8 py-3 text-base font-medium hover:bg-accent transition-colors"
              >
                ดูฐานข้อมูลอาหาร
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                ฟรี ไม่มีค่าใช้จ่าย
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                ไม่ต้องโหลดแอป
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                รองรับมือถือ
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          PURINE GUIDE SECTION
          ================================================================ */}
      <section className="py-16 sm:py-20 bg-background" id="purine-guide">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              ระดับพิวรีนในอาหาร
            </h2>
            <p className="mt-3 text-muted-foreground">
              เข้าใจระดับพิวรีนและเลือกอาหารได้อย่างชาญฉลาด
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {purineGuide.map((item) => (
              <div
                key={item.level}
                className={`rounded-xl border p-5 ${item.bg} ${item.border}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${item.dot}`} aria-hidden="true" />
                  <span className={`text-sm font-semibold ${item.text}`}>{item.action}</span>
                </div>
                <p className="font-medium text-foreground text-sm mb-1">{item.level}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ================================================================
          DISCLAIMER
          ================================================================ */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Disclaimer variant="card" />
        </div>
      </section>
    </div>
  )
}
