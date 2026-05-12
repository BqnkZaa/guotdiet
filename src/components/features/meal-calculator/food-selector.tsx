'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Loader2, Plus, X } from 'lucide-react'
import { FoodCategory, PurineLevel } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export interface FoodItem {
  id: string
  nameTh: string
  purinePerHg: number
  purineLevel: PurineLevel
  category: FoodCategory
}

interface FoodSelectorProps {
  onSelect: (food: FoodItem) => void
}

const levelColors = {
  VERY_HIGH: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200',
  HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200',
  MODERATE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200',
  LOW: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200',
}

export function FoodSelector({ onSelect }: FoodSelectorProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [results])

  // Search debounce
  useEffect(() => {
    const fetchFoods = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const res = await fetch(`/api/ingredients?q=${encodeURIComponent(query)}&limit=10`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.data.items)
        }
      } catch (err) {
        console.error('Failed to search foods', err)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchFoods()
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        const item = results[selectedIndex]
        if (item) {
          handleSelect(item)
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const handleSelect = (food: FoodItem) => {
    onSelect(food)
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="ค้นหาวัตถุดิบ (เช่น ไก่, ตับ, ผักกาด)..."
          className="pl-10 pr-8 h-14 text-base bg-accent/20 border-accent/40 focus-visible:bg-transparent focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40 rounded-xl transition-all shadow-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setResults([])
              setIsOpen(false)
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-muted"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {isOpen && query.trim() && (
        <div className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg outline-none animate-in fade-in-0 zoom-in-95">
          <div className="max-h-[350px] overflow-y-auto p-1.5">
            {loading ? (
              <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                กำลังค้นหา...
              </div>
            ) : results.length > 0 ? (
              results.map((food, index) => (
                <button
                  key={food.id}
                  onClick={() => handleSelect(food)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`relative flex w-full cursor-default select-none items-center rounded-md px-3 py-3 outline-none transition-colors min-h-[48px] ${
                    selectedIndex === index ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium text-base">{food.nameTh}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{food.purinePerHg} mg/100g</span>
                      <Badge variant="outline" className={`text-xs px-2 py-0.5 border ${levelColors[food.purineLevel]}`}>
                        {food.purineLevel}
                      </Badge>
                      <Plus className={`h-5 w-5 ml-1 ${selectedIndex === index ? 'text-foreground' : 'text-muted-foreground'}`} />
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="py-8 px-4 text-center">
                <p className="text-base font-medium text-foreground mb-1">ไม่พบวัตถุดิบ "{query}"</p>
                <p className="text-sm text-muted-foreground">ลองค้นหาด้วยคำอื่น หรือใช้คำที่กว้างขึ้น</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
