'use client'

import { useEffect } from 'react'
import Lottie from 'react-lottie'
import animationData from '@/assets/lottie/search-loading-animation.json'
import { cn } from '@/lib/utils'

interface FullscreenLoadingDialogProps {
  isOpen: boolean
  onComplete?: () => void
  duration?: number
}

export function FullscreenLoadingDialog({
  isOpen,
  onComplete,
  duration = 3000,
}: FullscreenLoadingDialogProps) {
  useEffect(() => {
    if (isOpen && onComplete) {
      const timer = setTimeout(() => {
        onComplete()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onComplete, duration])

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-black/50',
        'flex items-center justify-center p-4',
        'duration-300 animate-in fade-in-0'
      )}
    >
      <div className='mx-auto rounded-2xl bg-white p-12 shadow-2xl'>
        <div className='flex flex-col items-center space-y-8'>
          <Lottie options={defaultOptions} width={400} />
        </div>
      </div>
    </div>
  )
}
