import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Leaf,
  Salad,
  DropletIcon,
  ClipboardList,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Disclaimer } from '@/components/shared/disclaimer'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'GoutDiet — ระบบควบคุมอาหารและติดตามกรดยูริก',
  description: siteConfig.description,
}

const features = [
  {
    icon: Salad,
    title: 'ฐานข้อมูลอาหาร',
    description:
      'รายการอาหารกว่า 500 รายการพร้อมข้อมูลพิวรีนต่อ 100 กรัม จัดหมวดหมู่ตามระดับความเสี่ยง',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  {
    icon: ClipboardList,
    title: 'บันทึกมื้ออาหาร',
    description: 'บันทึกสิ่งที่รับประทานในแต่ละมื้อ ระบบคำนวณพิวรีนรวมอัตโนมัติ',
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
  },
  {
    icon: DropletIcon,
    title: 'ติดตามกรดยูริก',
    description: 'บันทึกผลการตรวจเลือด ดูแนวโน้มการเปลี่ยนแปลงของระดับกรดยูริกเป็นกราฟ',
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
  },
  {
    icon: LayoutDashboard,
    title: 'แดชบอร์ดสุขภาพ',
    description: 'ภาพรวมสุขภาพประจำวัน เปรียบเทียบกับเป้าหมาย และดูสถิติย้อนหลัง',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/40',
  },
]

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

const benefits = [
  'คำนวณพิวรีนรวมต่อวันอัตโนมัติ',
  'แจ้งเตือนเมื่อใกล้เกินเป้าหมาย',
  'รองรับการใช้งานบนมือถือ',
  'ข้อมูลเป็นภาษาไทยครบถ้วน',
  'ปลอดภัย ข้อมูลส่วนตัว',
  'ใช้งานฟรี ไม่มีค่าใช้จ่าย',
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
          FEATURES SECTION
          ================================================================ */}
      <section className="py-16 sm:py-24 bg-muted/20" id="features">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              ครบทุกอย่างที่คุณต้องการ
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              ออกแบบมาเพื่อช่วยผู้ป่วยโรคเกาต์ดูแลตัวเองได้ง่ายขึ้น
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-border/60 bg-card/70 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <CardContent className="p-6 space-y-4">
                  <div
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${feature.bg}`}
                  >
                    <feature.icon className={`h-5 w-5 ${feature.color}`} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          BENEFITS SECTION
          ================================================================ */}
      <section className="py-16 sm:py-24 bg-background" id="benefits">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                ทำไมต้องเลือก{' '}
                <span className="text-primary">GoutDiet?</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                เราออกแบบมาเพื่อผู้ป่วยโรคเกาต์ชาวไทยโดยเฉพาะ ฐานข้อมูลอาหารครอบคลุมอาหารไทยที่พบบ่อย
                พร้อมข้อมูลพิวรีนที่อ้างอิงจากแหล่งข้อมูลทางวิทยาศาสตร์
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                    <span className="text-sm text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link
                id="benefits-cta"
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg gradient-brand text-white px-6 py-2.5 text-sm font-semibold shadow-md hover:opacity-90 transition-opacity"
              >
                สมัครใช้งานฟรี
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right: Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '500+', label: 'รายการอาหาร', sub: 'ในฐานข้อมูล' },
                { value: '4', label: 'ระดับพิวรีน', sub: 'จำแนกอย่างชัดเจน' },
                { value: '100%', label: 'ภาษาไทย', sub: 'ใช้งานง่าย' },
                { value: 'Free', label: 'ฟรีตลอด', sub: 'ไม่มีค่าใช้จ่าย' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border/60 bg-card p-6 text-center hover:border-primary/40 transition-colors"
                >
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA SECTION
          ================================================================ */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl gradient-brand p-10 sm:p-14 text-center shadow-xl shadow-primary/20">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 40%)',
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                เริ่มต้นดูแลสุขภาพวันนี้
              </h2>
              <p className="mt-3 text-white/80 leading-relaxed max-w-lg mx-auto">
                สมัครฟรี ไม่ต้องดาวน์โหลดแอป เข้าถึงได้จากทุกอุปกรณ์
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  id="final-cta-register"
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-white text-primary hover:bg-white/90 px-8 py-3 text-base font-semibold shadow-md transition-colors"
                >
                  สมัครสมาชิกฟรี
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  id="final-cta-login"
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg text-white hover:bg-white/20 px-8 py-3 text-base font-medium transition-colors"
                >
                  เข้าสู่ระบบ
                </Link>
              </div>
            </div>
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
