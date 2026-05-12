'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="th">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-red-600">ข้อผิดพลาดร้ายแรงของระบบ</h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              ระบบไม่สามารถทำงานต่อไปได้ กรุณารีเฟรชหน้าเว็บหรือติดต่อผู้ดูแลระบบ
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </body>
    </html>
  )
}
