import { AlertTriangle } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

interface DisclaimerProps {
  variant?: 'banner' | 'card' | 'inline'
  className?: string
}

/**
 * Medical disclaimer component.
 * IMPORTANT: Must be displayed prominently in health-related sections.
 * This platform is NOT a medical diagnosis tool.
 */
export function Disclaimer({ variant = 'card', className }: DisclaimerProps) {
  if (variant === 'inline') {
    return (
      <p className={cn('text-xs text-muted-foreground italic', className)}>
        ⚠️ {siteConfig.disclaimer}
      </p>
    )
  }

  if (variant === 'banner') {
    return (
      <div
        className={cn(
          'flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 px-4 py-3',
          className
        )}
        role="note"
        aria-label="ข้อสังเกตทางการแพทย์"
      >
        <AlertTriangle
          className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0"
          aria-hidden="true"
        />
        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
          <strong>ข้อสังเกต:</strong> {siteConfig.disclaimer}
        </p>
      </div>
    )
  }

  // card variant (default)
  return (
    <div
      className={cn(
        'rounded-xl border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/70 dark:bg-amber-950/20 p-4',
        className
      )}
      role="note"
      aria-label="ข้อสังเกตทางการแพทย์"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
          <AlertTriangle
            className="h-4 w-4 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            ข้อสังเกตสำคัญ
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            {siteConfig.disclaimer}
          </p>
        </div>
      </div>
    </div>
  )
}
