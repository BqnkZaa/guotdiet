'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Menu, X, Leaf, Calculator, Database, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

const mainNavItems = [
  { href: '/', label: 'หน้าแรก', icon: Home },
  { href: '/calculator', label: 'เครื่องคิดพิวรีน', icon: Calculator },
  { href: '/foods', label: 'ฐานข้อมูลอาหาร', icon: Database },
]

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md theme-transition">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label={siteConfig.name}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand shadow-sm transition-transform group-hover:scale-105">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-primary">Gout</span>
            <span className="text-foreground">Diet</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side: Theme toggle */}
        <div className="flex items-center gap-2">
          <Button
            id="theme-toggle-btn"
            variant="ghost"
            size="icon"
            aria-label="สลับธีม"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full"
          />

          {/* Mobile Hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              id="mobile-menu-btn"
              className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring outline-none"
              aria-label="เปิดเมนู"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetHeader className="p-6 pb-4 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-brand">
                    <Leaf className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-base font-bold">
                    <span className="text-primary">Gout</span>Diet
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
