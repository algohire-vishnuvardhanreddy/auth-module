import type React from 'react'
import { useState, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface BadgeInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
}

export function BadgeInput({
  value,
  onChange,
  placeholder,
  disabled,
}: BadgeInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showError, setShowError] = useState(false)

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  const addEmail = (email: string) => {
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setShowError(false)
      return
    }

    if (!isValidEmail(trimmedEmail)) {
      setShowError(true)
      setTimeout(() => setShowError(false), 2000)
      return
    }

    if (value.includes(trimmedEmail)) {
      setShowError(true)
      setTimeout(() => setShowError(false), 2000)
      setInputValue('')
      return
    }

    onChange([...value, trimmedEmail])
    setInputValue('')
    setShowError(false)
  }

  const removeEmail = (emailToRemove: string) => {
    onChange(value.filter((email) => email !== emailToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === ' ' ||
      e.key === 'Enter' ||
      e.key === ',' ||
      e.key === 'Tab'
    ) {
      e.preventDefault()
      if (inputValue.trim()) {
        addEmail(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeEmail(value[value.length - 1])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    if (newValue.endsWith(' ')) {
      const emailToAdd = newValue.trim()
      if (emailToAdd && isValidEmail(emailToAdd)) {
        addEmail(emailToAdd)
      }
    }

    // Clear error when user starts typing
    if (showError) {
      setShowError(false)
    }
  }

  const handleBlur = () => {
    if (inputValue.trim()) {
      addEmail(inputValue)
    }
  }

  return (
    <div className='space-y-1'>
      <div
        className={`flex min-h-[44px] flex-wrap gap-2 rounded-md border p-3 transition-colors ${
          showError
            ? 'border-destructive focus-within:ring-destructive'
            : 'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
        } ${disabled ? 'cursor-not-allowed bg-muted' : 'bg-background'}`}
      >
        {value.map((email) => (
          <Badge
            key={email}
            variant='secondary'
            className='flex items-center gap-1 px-2 py-1'
          >
            <span className='text-sm'>{email}</span>
            {!disabled && (
              <button
                type='button'
                onClick={() => removeEmail(email)}
                className='ml-1 rounded-full p-0.5 transition-colors hover:bg-destructive hover:text-destructive-foreground'
                aria-label={`Remove ${email}`}
              >
                <X className='h-3 w-3' />
              </button>
            )}
          </Badge>
        ))}
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={value.length === 0 ? placeholder : ''}
          className='min-w-[140px] flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0'
          disabled={disabled}
        />
      </div>
      {showError && (
        <p className='text-sm text-destructive'>
          Please enter a valid email address. Duplicates are not allowed.
        </p>
      )}
    </div>
  )
}
