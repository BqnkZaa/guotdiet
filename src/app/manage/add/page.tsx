'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Info } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFoodAction } from '@/app/actions/foods'

const categories = [
  { value: 'MEAT', label: 'เนื้อสัตว์' },
  { value: 'SEAFOOD', label: 'อาหารทะเล' },
  { value: 'POULTRY', label: 'สัตว์ปีก' },
  { value: 'ORGAN_MEAT', label: 'เครื่องใน' },
  { value: 'LEGUMES', label: 'ถั่ว' },
  { value: 'VEGETABLES', label: 'ผัก' },
  { value: 'FRUITS', label: 'ผลไม้' },
  { value: 'GRAINS', label: 'ธัญพืช' },
  { value: 'DAIRY', label: 'นม/ผลิตภัณฑ์นม' },
  { value: 'BEVERAGES', label: 'เครื่องดื่ม' },
  { value: 'OTHER', label: 'อื่นๆ' },
]

const purineLevels = [
  { value: 'LOW', label: 'ต่ำ (<50 mg)', color: 'text-green-600' },
  { value: 'MODERATE', label: 'ปานกลาง (50-150 mg)', color: 'text-yellow-600' },
  { value: 'HIGH', label: 'สูง (150-300 mg)', color: 'text-orange-600' },
  { value: 'VERY_HIGH', label: 'สูงมาก (>300 mg)', color: 'text-red-600' },
]

export default function AddFoodPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createFoodAction, {
    success: false,
    message: '',
  })

  // Auto-calculate Purine Level based on input amount
  const [purineAmount, setPurineAmount] = useState<string>('')
  const [suggestedLevel, setSuggestedLevel] = useState<string>('')

  useEffect(() => {
    const amount = parseFloat(purineAmount)
    if (!isNaN(amount)) {
      if (amount < 50) setSuggestedLevel('LOW')
      else if (amount <= 150) setSuggestedLevel('MODERATE')
      else if (amount <= 300) setSuggestedLevel('HIGH')
      else setSuggestedLevel('VERY_HIGH')
    } else {
      setSuggestedLevel('')
    }
  }, [purineAmount])

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message)
        router.push('/manage')
      } else {
        toast.error(state.message)
      }
    }
  }, [state, router])

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 px-4 sm:px-0">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/manage">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">เพิ่มวัตถุดิบใหม่</h1>
          <p className="text-sm text-muted-foreground">ข้อมูลจะถูกบันทึกเข้าสู่ฐานข้อมูลส่วนกลาง</p>
        </div>
      </div>

      <Card className="border-border/60 shadow-sm">
        <form action={formAction}>
          <CardHeader>
            <CardTitle>ข้อมูลทั่วไป</CardTitle>
            <CardDescription>กรุณากรอกชื่อและหมวดหมู่ของวัตถุดิบ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid gap-2">
              <Label htmlFor="nameTh" className="text-base font-medium">ชื่อภาษาไทย <span className="text-red-500">*</span></Label>
              <Input id="nameTh" name="nameTh" placeholder="เช่น เนื้อไก่" required className="h-12 text-base" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nameEn" className="text-base font-medium">ชื่อภาษาอังกฤษ <span className="text-red-500">*</span></Label>
              <Input id="nameEn" name="nameEn" placeholder="เช่น Chicken breast" required className="h-12 text-base" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category" className="text-base font-medium">หมวดหมู่ <span className="text-red-500">*</span></Label>
              <select 
                id="category" 
                name="category" 
                required
                className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">-- เลือกหมวดหมู่ --</option>
                {categories.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-2 pt-4 border-t border-border/50">
              <Label htmlFor="purinePerHg" className="text-base font-medium">
                ปริมาณพิวรีน (mg ต่อ 100g) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input 
                  id="purinePerHg" 
                  name="purinePerHg" 
                  type="number" 
                  step="0.1"
                  min="0"
                  required 
                  value={purineAmount}
                  onChange={(e) => setPurineAmount(e.target.value)}
                  placeholder="0.0" 
                  className="h-12 text-base pr-12" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">mg</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="purineLevel" className="text-base font-medium">ระดับความเสี่ยง <span className="text-red-500">*</span></Label>
              <select 
                id="purineLevel" 
                name="purineLevel" 
                required
                value={suggestedLevel || undefined}
                onChange={(e) => setSuggestedLevel(e.target.value)}
                className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">-- เลือกระดับความเสี่ยง --</option>
                {purineLevels.map(l => (
                  <option key={l.value} value={l.value} className={l.color}>{l.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                <Info className="h-4 w-4 shrink-0 text-blue-500" />
                <p>ระบบจะแนะนำระดับความเสี่ยงอัตโนมัติเมื่อกรอกปริมาณพิวรีน</p>
              </div>
            </div>

            <div className="grid gap-2 pt-4 border-t border-border/50">
              <Label htmlFor="aliases" className="text-base font-medium">คำค้นหาอื่นๆ (คั่นด้วยลูกน้ำ)</Label>
              <Input id="aliases" name="aliases" placeholder="เช่น ไก่, อกไก่, น่องไก่" className="h-12 text-base" />
              <p className="text-sm text-muted-foreground">ช่วยให้ผู้ใช้ค้นหาวัตถุดิบนี้เจอได้ง่ายขึ้นแม้จะพิมพ์คำอื่น</p>
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                className="w-full h-12 text-base gradient-brand text-white" 
                disabled={isPending}
              >
                {isPending ? 'กำลังบันทึก...' : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    บันทึกข้อมูลวัตถุดิบ
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
