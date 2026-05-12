'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to detect responsive breakpoints
 * Returns true when screen width is at or above the given breakpoint
 *
 * @example
 * const isMd = useMediaQuery('(min-width: 768px)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

// Convenience hooks for common breakpoints
export const useIsMobile = () => !useMediaQuery('(min-width: 768px)')
export const useIsTablet = () => useMediaQuery('(min-width: 768px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
