'use client'

import { cn } from '@/lib/utils'

interface SparkleIconProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'pulse' | 'rotate' | 'twinkle'
}

export default function SparkleIcon({
  className,
  size = 'md',
  variant = 'twinkle',
}: SparkleIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    rotate: 'animate-spin',
    twinkle: 'animate-bounce',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        sizeClasses[size],
        animationClasses[variant],
        className
      )}
    >
      <svg
        viewBox='0 0 24 24'
        fill='none'
        className='h-full w-full'
        style={{
          animationDuration:
            variant === 'rotate' ? '3s' : variant === 'pulse' ? '2s' : '1.5s',
        }}
      >
        {/* Main sparkle shape */}
        <path
          d='M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z'
          className='fill-yellow-400 dark:fill-yellow-300'
        />

        {/* Smaller sparkles */}
        <circle
          cx='6'
          cy='6'
          r='1'
          className='animate-ping fill-yellow-300 dark:fill-yellow-200'
          style={{ animationDelay: '0.5s', animationDuration: '2s' }}
        />
        <circle
          cx='18'
          cy='6'
          r='0.8'
          className='animate-ping fill-yellow-300 dark:fill-yellow-200'
          style={{ animationDelay: '1s', animationDuration: '2s' }}
        />
        <circle
          cx='18'
          cy='18'
          r='1'
          className='animate-ping fill-yellow-300 dark:fill-yellow-200'
          style={{ animationDelay: '1.5s', animationDuration: '2s' }}
        />
        <circle
          cx='6'
          cy='18'
          r='0.8'
          className='animate-ping fill-yellow-300 dark:fill-yellow-200'
          style={{ animationDelay: '0.2s', animationDuration: '2s' }}
        />
      </svg>
    </div>
  )
}
