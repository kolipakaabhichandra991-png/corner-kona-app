'use client'

import { cn } from '@/lib/utils'

const BARS = [0.4, 0.9, 0.45, 1, 0.7, 0.35, 0.85, 0.55, 0.95, 0.45, 0.75, 0.6, 1, 0.4, 0.8, 0.55, 0.9, 0.35]

export function Waveform({
  className,
  playing = true,
  interactive = false,
  onToggle,
}: {
  className?: string
  playing?: boolean
  interactive?: boolean
  onToggle?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={!interactive}
      title={interactive ? (playing ? 'Pause Audio' : 'Play Audio') : undefined}
      className={cn(
        'items-center gap-1 flex h-10 px-2 rounded-xl transition-all',
        interactive && 'cursor-pointer hover:bg-white/10 active:scale-95',
        className
      )}
      aria-label="Audio waveform visualization"
    >
      {BARS.map((h, i) => (
        <span
          key={i}
          className={cn(
            'w-1 origin-center rounded-full transition-all duration-300',
            playing
              ? 'animate-wave bg-gradient-to-t from-[#9333EA] to-[#0EA5E9]'
              : 'bg-primary/50'
          )}
          style={{
            height: playing ? `${Math.max(25, h * 100)}%` : `${Math.max(20, h * 40)}%`,
            animationDelay: `${(i % 6) * 110}ms`,
            animationDuration: `${0.75 + (i % 4) * 0.25}s`,
          }}
        />
      ))}
    </button>
  )
}
