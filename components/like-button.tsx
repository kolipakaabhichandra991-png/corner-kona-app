'use client'

import PulseHeart from '@/components/ui/pulse-heart'

const tones = {
  surface: { pill: 'var(--muted)', idle: 'var(--muted-foreground)', text: 'var(--foreground)' },
  ink: {
    pill: 'color-mix(in srgb, var(--ink-foreground) 14%, transparent)',
    idle: 'color-mix(in srgb, var(--ink-foreground) 70%, transparent)',
    text: 'var(--ink-foreground)',
  },
} as const

function seededCount(id: string) {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return 120 + (h % 4800)
}

export function LikeButton({
  id,
  label,
  size = 18,
  tone = 'surface',
  className,
}: {
  id: string
  label: string
  size?: number
  tone?: keyof typeof tones
  className?: string
}) {
  const t = tones[tone]
  return (
    <PulseHeart
      count={seededCount(id)}
      size={size}
      label={label}
      likedColor="var(--section-live)"
      idleColor={t.idle}
      pillColor={t.pill}
      textColor={t.text}
      className={className}
    />
  )
}
