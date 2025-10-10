'use client'

import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Search, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface CommandSelectorProps {
  items: string[]
  value: string
  setValue: (value: string) => void
  placeholder?: string
  trigger?: React.ReactNode
  compact?: boolean
}

export function CommandSelector({
  items,
  value,
  setValue,
  placeholder = 'Search...',
  trigger,
  compact = true,
}: CommandSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredItems = items.filter((item) => {
    const searchLower = search.toLowerCase()
    return item.toLowerCase().includes(searchLower)
  })

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        )
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex])
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, filteredItems, selectedIndex])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  useEffect(() => {
    if (!open) {
      setSearch('')
      setSelectedIndex(0)
    }
  }, [open])

  const handleSelect = (item: string) => {
    setValue(item)
    setOpen(false)
  }

  const TriggerButton = trigger || (
    <Button
      variant='outline'
      role='combobox'
      aria-expanded={open}
      size={compact ? 'sm' : 'default'}
      className={cn(
        'flex items-center justify-between gap-2 bg-transparent text-muted-foreground',
        compact ? 'h-8 min-w-[200px] px-2' : 'min-w-[300px]'
      )}
    >
      <div className='flex items-center gap-2'>
        <Search className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
        <span
          className={cn(
            compact ? 'text-xs' : 'text-sm',
            value && 'text-foreground'
          )}
        >
          {value || placeholder}
        </span>
      </div>
      <ChevronDown className='h-3 w-3 opacity-50' />
    </Button>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{TriggerButton}</PopoverTrigger>
      <PopoverContent
        className={cn('p-0', compact ? 'w-[250px]' : 'w-[400px]')}
        align='start'
      >
        <div
          className={cn(
            'flex items-center border-b',
            compact ? 'px-3 py-2' : 'px-4 py-3'
          )}
        >
          <Search
            className={cn(
              'mr-2 text-muted-foreground',
              compact ? 'h-3 w-3' : 'h-4 w-4'
            )}
          />
          <Input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'border-0 focus-visible:ring-0 focus-visible:ring-offset-0',
              compact && 'h-6 text-sm'
            )}
          />
        </div>

        <div
          className={cn(
            'max-h-[300px] overflow-y-auto',
            compact ? 'max-h-[250px]' : 'max-h-[300px]'
          )}
        >
          {filteredItems.length === 0 ? (
            <div
              className={cn(
                'text-center text-muted-foreground',
                compact ? 'p-3 text-sm' : 'p-4'
              )}
            >
              No items found
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={item}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-2 hover:bg-accent',
                  compact ? 'px-3 py-2' : 'px-4 py-3',
                  index === selectedIndex && 'bg-accent'
                )}
                onClick={() => handleSelect(item)}
              >
                <div className='min-w-0 flex-1'>
                  <div
                    className={cn(
                      'font-medium',
                      compact ? 'text-sm' : 'text-sm'
                    )}
                  >
                    {item}
                  </div>
                </div>
                {value === item && (
                  <Check
                    className={cn(
                      'text-primary',
                      compact ? 'h-3 w-3' : 'h-4 w-4'
                    )}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
