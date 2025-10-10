interface ScoreIndicatorProps {
  score: number
  maxScore?: number
  showSymbol?: boolean
  label?: string
}

export default function ScoreIndicator({
  score,
  maxScore = 100,
  label = 'Score',
}: ScoreIndicatorProps) {
  // Handle edge cases
  if (maxScore <= 0) {
    console.warn('ScoreIndicator: maxScore must be greater than 0')
    return null
  }

  // Clamp score between 0 and maxScore to prevent overflow
  const clampedScore = Math.max(0, Math.min(score, maxScore))

  // Calculate percentage with proper bounds
  const percentage = Math.round((clampedScore / maxScore) * 100)

  // Determine color based on percentage with more visible light colors
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-emerald-400 dark:bg-emerald-600' // More visible green
    if (percentage >= 60) return 'bg-yellow-400 dark:bg-yellow-600' // More visible yellow
    if (percentage >= 40) return 'bg-orange-400 dark:bg-orange-600' // More visible orange
    return 'bg-red-400 dark:bg-red-600' // More visible red
  }

  const getScoreColorText = (percentage: number) => {
    if (percentage >= 80) return 'text-emerald-600 dark:text-emerald-400'
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400'
    if (percentage >= 40) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const color = getScoreColor(percentage)
  const textColor = getScoreColorText(percentage)

  return (
    <div className='flex w-full items-center gap-2'>
      <span
        className={`min-w-[30px] text-sm font-medium tabular-nums ${textColor}`}
      >
        {clampedScore}%
      </span>
      <div
        className='h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'
        role='progressbar'
        aria-valuenow={clampedScore}
        aria-valuemin={0}
        aria-valuemax={maxScore}
        aria-label={`${label}: ${clampedScore} out of ${maxScore}`}
      >
        <div
          className={`h-full transition-all duration-300 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
