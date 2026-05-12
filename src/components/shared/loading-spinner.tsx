import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

/**
 * Reusable loading spinner with optional label
 */
export function LoadingSpinner({ size = 'md', className, label = 'กำลังโหลด...' }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-7 w-7 border-2',
    lg: 'h-12 w-12 border-[3px]',
  }

  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3', className)}
      role="status"
      aria-label={label}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-primary/30 border-t-primary',
          sizeMap[size]
        )}
      />
      {label && (
        <p className="text-sm text-muted-foreground animate-pulse">{label}</p>
      )}
    </div>
  )
}

/**
 * Full-page loading state
 */
export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}
