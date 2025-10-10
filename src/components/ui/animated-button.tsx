'use client'

import type React from 'react'
import { useState } from 'react'
import type { MouseEventHandler, KeyboardEventHandler } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AnimatedButtonProps {
  variant?:
    | 'default'
    | 'link'
    | 'outline'
    | 'destructive'
    | 'secondary'
    | 'ghost'
    | null
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  children?: React.ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
}

export default function AnimatedButton({
  variant = 'default',
  disabled,
  loading = false,
  icon,
  children,
  onClick,
  onKeyDown,
  type = 'button',
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className='w-full'
    >
      <Button
        variant={variant}
        type={type}
        className='flex w-full items-center gap-2 overflow-hidden'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        onKeyDown={onKeyDown}
        disabled={disabled || loading}
      >
        {loading ? (
          <Loader2 className='animate-spin' />
        ) : (
          <>
            {children}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: isHovered ? 0 : -20, opacity: isHovered ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {icon}
            </motion.div>
          </>
        )}
      </Button>
    </motion.div>
  )
}
