'use client'

import { useState } from 'react'
import { Food } from '@prisma/client'
import { Plus, LogOut, Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { logoutAdmin } from '@/app/actions/manage'
import { deleteFoodAction } from '@/app/actions/foods'

interface Props {
  foods: Food[]
}

const levelColors: Record<string, string> = {
  VERY_HIGH: 'bg-red-100 text-red-700 border-red-200',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
  MODERATE: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  LOW: 'bg-green-100 text-green-700 border-green-200',
}

export function AdminDashboard({ foods }: Props) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleLogout = async () => {
    await logoutAdmin()
    router.refresh()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบวัตถุดิบ "${name}"?`)) return

    setIsDeleting(id)
    const result = await deleteFoodAction(id)
    if (result.success) {
      toast.success('ลบวัตถุดิบสำเร็จ')
    } else {
      toast.error('ไม่สามารถลบได้: ' + result.error)
    }
    setIsDeleting(null)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">จัดการฐานข้อมูลวัตถุดิบ</h1>
          <p className="text-sm text-muted-foreground">ทั้งหมด {foods.length} รายการ</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="gradient-brand text-white border-0">
            <Link href="/foods/add">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มวัตถุดิบ
            </Link>
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            ออกจากระบบ
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-3">ชื่อวัตถุดิบ</th>
                <th className="px-6 py-3">พิวรีน (mg/100g)</th>
                <th className="px-6 py-3">ระดับ</th>
                <th className="px-6 py-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {foods.map((food) => (
                <tr key={food.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {food.nameTh}
                    <div className="text-xs text-muted-foreground font-normal">{food.nameEn}</div>
                  </td>
                  <td className="px-6 py-4">{food.purinePerHg}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={levelColors[food.purineLevel]}>
                      {food.purineLevel}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {/* Optional: Add Edit Route Later if needed */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(food.id, food.nameTh)}
                      disabled={isDeleting === food.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {foods.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    ไม่มีข้อมูลวัตถุดิบ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
