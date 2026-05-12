'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[PAGE_ERROR]', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">เกิดข้อผิดพลาดในการโหลดหน้าจอ</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {error.message || 'ระบบไม่สามารถประมวลผลคำขอของคุณได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง'}
        </p>
      </div>
      <Button 
        onClick={() => reset()}
        variant="outline"
        className="mt-4"
      >
        ลองใหม่อีกครั้ง
      </Button>
    </div>
  )
}
