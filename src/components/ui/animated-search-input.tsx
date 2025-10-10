'use client'

import type React from 'react'
import { useState, useEffect, useRef, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface AnimatedSearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholders?: string[]
  onSearch?: (query: string) => void
  isLoading: Boolean
  buttonIcon?: React.ReactNode
  placeholderChangeInterval?: number
  showSubmitButton?: boolean
  minQueryLength?: number
}

const AnimatedSearchInput = forwardRef<
  HTMLInputElement,
  AnimatedSearchInputProps
>(
  (
    {
      placeholders = [
        'Search for something...',
        'Type your query here...',
        'What are you looking for?',
      ],
      onSearch,
      isLoading,
      placeholderChangeInterval = 3000,
      showSubmitButton = true,
      minQueryLength = 3,
      className = '',
      ...props
    },
    ref
  ) => {
    const [query, setQuery] = useState(props.value?.toString() || '')
    const [placeholderIndex, setPlaceholderIndex] = useState(0)
    const [isFocused, setIsFocused] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const combinedRef = (node: HTMLInputElement) => {
      // Handle both the forwarded ref and our local ref
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
      inputRef.current = node
    }

    // Only start the interval if the query is empty
    useEffect(() => {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      // Only start a new interval if the query is empty
      if (query === '') {
        intervalRef.current = setInterval(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
        }, placeholderChangeInterval)
      }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }, [query, placeholders.length, placeholderChangeInterval])

    // Update query when props.value changes
    useEffect(() => {
      if (props.value !== undefined) {
        setQuery(props.value.toString())
      }
    }, [props.value])

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setQuery(newValue)
      props.onChange?.(e)
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (query.length < minQueryLength || isPending) return

      setIsPending(true)
      try {
        await onSearch?.(query)
      } finally {
        setIsPending(false)
      }
    }

    return (
      <form onSubmit={handleSubmit} className='relative w-full'>
        <Input
          ref={combinedRef}
          disabled={isLoading ? true : false}
          type='text'
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            'text-md h-14 w-full rounded-full pl-6 pr-16 shadow-sm',
            'border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950',
            'text-gray-900 dark:text-gray-100',
            className
          )}
          placeholder=''
          {...props}
        />
        <AnimatePresence mode='wait'>
          {!isFocused && query === '' && (
            <motion.span
              key={placeholderIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='pointer-events-none absolute left-6 top-[1rem] w-[80%] -translate-y-1/2 overflow-hidden text-ellipsis whitespace-nowrap text-lg text-gray-500 dark:text-gray-400'
            >
              {placeholders[placeholderIndex]}
            </motion.span>
          )}
        </AnimatePresence>
        {showSubmitButton && (
          <Button
            disabled={
              (isLoading ? true : false) || query.length < minQueryLength
            }
            loading={isLoading ? true : false}
            icon={ArrowRight}
            iconPlacement='right'
            type='submit'
            size='icon'
            className={
              cn('absolute right-2 top-2 rounded-full')
              // 'bg-black hover:bg-black/90 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200'
            }
          ></Button>
        )}
      </form>
    )
  }
)

AnimatedSearchInput.displayName = 'AnimatedSearchInput'

export { AnimatedSearchInput }
