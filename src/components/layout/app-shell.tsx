import { cn } from '@/lib/utils'

interface AppShellProps {
  children: React.ReactNode
  className?: string
  /** When true, removes max-width constraint (full-width layout) */
  fullWidth?: boolean
  /** Padding preset */
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

/**
 * App Shell — main content area wrapper.
 * Used inside dashboard/protected layouts to provide consistent spacing.
 */
export function AppShell({
  children,
  className,
  fullWidth = false,
  padding = 'md',
}: AppShellProps) {
  const paddingMap = {
    none: '',
    sm: 'px-4 py-4 sm:px-6',
    md: 'px-4 py-6 sm:px-6 lg:px-8',
    lg: 'px-4 py-8 sm:px-6 lg:px-10',
  }

  return (
    <main
      className={cn(
        'flex-1',
        !fullWidth && 'mx-auto w-full max-w-7xl',
        paddingMap[padding],
        className
      )}
    >
      {children}
    </main>
  )
}
