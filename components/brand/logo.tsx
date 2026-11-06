import Image from 'next/image'
import { brand } from '@/config/brand'
import { cn } from '@/lib/utils'

export interface LogoProps {
  compact?: boolean
  className?: string
  variant?: 'horizontal' | 'mark' | 'full'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Corner Kona client brand logo:
 * Uses the 3D interlocking "CK" monogram with purple & cyan styling.
 */
export function Logo({
  compact = false,
  className,
  variant = 'horizontal',
  size = 'md',
}: LogoProps) {
  if (variant === 'full') {
    return (
      <span className={cn('inline-flex flex-col items-center gap-1 select-none', className)}>
        <Image
          src="/images/corner-kona-logo.png"
          alt={brand.name}
          width={compact ? 120 : 160}
          height={compact ? 130 : 175}
          priority
          className={cn(
            'object-contain transition-all duration-300 drop-shadow-md',
            compact ? 'h-10 w-auto' : 'h-14 md:h-16 w-auto'
          )}
        />
        <span className="sr-only">{brand.name}</span>
      </span>
    )
  }

  const markSize =
    size === 'sm'
      ? compact ? 28 : 32
      : size === 'lg'
      ? compact ? 36 : 48
      : compact ? 32 : 40

  return (
    <span className={cn('inline-flex items-center gap-2.5 select-none group', className)}>
      {/* 3D Interlocking CK Monogram */}
      <span className="relative flex shrink-0 items-center justify-center">
        <Image
          src="/images/corner-kona-mark.png"
          alt="Corner Kona Mark"
          width={markSize * 2}
          height={markSize * 2}
          priority
          className={cn(
            'object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_4px_12px_rgba(139,92,246,0.18)]',
            compact ? 'size-8' : size === 'lg' ? 'size-12' : 'size-9 md:size-10'
          )}
        />
      </span>

      {/* Stylized Wordmark: CORNER in purple, KONA in cyan/blue */}
      {variant !== 'mark' && (
        <span
          className={cn(
            'flex flex-col font-display leading-none transition-all duration-300',
            compact ? 'w-0 overflow-hidden opacity-0 sm:w-auto sm:opacity-100' : 'opacity-100'
          )}
        >
          <span
            className={cn(
              'font-black uppercase tracking-tight',
              compact ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg md:text-xl'
            )}
          >
            <span className="bg-gradient-to-r from-[#9333EA] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
              CORNER
            </span>
            <span className="bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] bg-clip-text text-transparent ml-0.5">
              KONA
            </span>
          </span>
        </span>
      )}

      <span className="sr-only">{brand.name}</span>
    </span>
  )
}
