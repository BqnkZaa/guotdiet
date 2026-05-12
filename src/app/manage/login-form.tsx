'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { loginAdmin } from '@/app/actions/manage'
import { toast } from 'sonner'

export function AdminLoginForm() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const success = await loginAdmin(password)
    if (success) {
      toast.success('เข้าสู่ระบบสำเร็จ')
      router.refresh()
    } else {
      toast.error('รหัสผ่านไม่ถูกต้อง')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md border-border/60">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>การจัดการระบบ</CardTitle>
          <CardDescription>กรุณาใส่รหัสผ่านเพื่อเข้าสู่ระบบจัดการฐานข้อมูล</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
              required
            />
            <Button 
              type="submit" 
              className="w-full h-12 gradient-brand text-white"
              disabled={loading}
            >
              {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
