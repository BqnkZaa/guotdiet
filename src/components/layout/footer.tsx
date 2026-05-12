import Link from 'next/link'
import { Leaf, Heart } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { siteConfig } from '@/config/site'
import { footerNavItems } from '@/config/navigation'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30 theme-transition">
      {/* Medical Disclaimer Banner */}
      <div className="border-b border-border/40 bg-amber-50/60 dark:bg-amber-950/20 py-3 px-4">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            ⚠️ <strong>ข้อสังเกต:</strong> {siteConfig.disclaimer}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand column */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand shadow-sm transition-transform group-hover:scale-105">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-primary">Gout</span>
                <span className="text-foreground">Diet</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {siteConfig.description}
            </p>
            <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-sm">
              แอปพลิเคชันนี้เป็นเครื่องมือช่วยติดตามข้อมูลเท่านั้น
              ไม่ใช่คำแนะนำทางการแพทย์
            </p>
          </div>


          {/* Features column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">ฟีเจอร์</h3>
            <div className="flex flex-col gap-2">
              {[
                'ฐานข้อมูลอาหาร',
                'คำนวณพิวรีน',
                'บันทึกมื้ออาหาร',
                'ติดตามกรดยูริก',
                'แดชบอร์ดสุขภาพ',
              ].map((feature) => (
                <span key={feature} className="text-sm text-muted-foreground">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8 opacity-60" />

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            สร้างด้วย <Heart className="h-3 w-3 text-red-400 fill-red-400" aria-hidden="true" /> เพื่อสุขภาพที่ดีกว่า
          </p>
        </div>
      </div>
    </footer>
  )
}
