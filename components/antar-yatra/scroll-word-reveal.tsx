'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollWordRevealProps {
  text: string
  className?: string
  as?: 'h2' | 'h3' | 'p' | 'div'
}

/**
 * Replicates the Purpose-Green SplitType + ScrollTrigger scrub effect.
 * As the user scrolls through the container, words progressively transition
 * from 25% opacity to 100% full brightness with smooth easing.
 */
export function ScrollWordReveal({
  text,
  className = '',
  as: Component = 'p',
}: ScrollWordRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Start when container reaches 75% of viewport, end at 30%
      const start = windowHeight * 0.78
      const end = windowHeight * 0.28
      const total = start - end

      if (rect.top > start) {
        setProgress(0)
      } else if (rect.top < end) {
        setProgress(1)
      } else {
        const current = (start - rect.top) / total
        setProgress(Math.min(Math.max(current, 0), 1))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const words = text.split(' ')

  return (
    <div ref={containerRef} className={className}>
      <Component className="inline leading-relaxed">
        {words.map((word, idx) => {
          // Calculate when each word lights up
          const wordThreshold = idx / words.length
          const isRevealed = progress >= wordThreshold
          // Soft interpolation factor for active word
          const diff = progress - wordThreshold
          const wordOpacity = isRevealed ? 1 : Math.max(0.22, 0.22 + diff * 3)

          return (
            <span
              key={idx}
              style={{
                opacity: wordOpacity,
                transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              className="inline-block transition-colors duration-200 mr-[0.28em] last:mr-0"
            >
              {word}
            </span>
          )
        })}
      </Component>
    </div>
  )
}
