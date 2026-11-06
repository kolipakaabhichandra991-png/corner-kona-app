'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number // in ms (e.g. 100, 200, 300)
  duration?: number // in ms (default: 700)
  direction?: 'up' | 'down' | 'scale' | 'fade'
  threshold?: number // 0 to 1
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 700,
  direction = 'up',
  threshold = 0.12,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el) // Reveal once smoothly
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translate3d(0, 32px, 0)'
      case 'down':
        return 'translate3d(0, -32px, 0)'
      case 'scale':
        return 'scale(0.94) translate3d(0, 20px, 0)'
      case 'fade':
      default:
        return 'translate3d(0, 0, 0)'
    }
  }

  return (
    <div
      ref={ref}
      suppressHydrationWarning
      style={{
        transform: isVisible ? 'translate3d(0, 0, 0) scale(1)' : getInitialTransform(),
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
      className={cn('transition-all will-change-[transform,opacity]', className)}
    >
      {children}
    </div>
  )
}

/**
 * Container that automatically staggers the entrance of its children
 */
export function ScrollRevealGroup({
  children,
  className = '',
  staggerMs = 120,
  direction = 'up',
  threshold = 0.1,
}: {
  children: ReactNode[]
  className?: string
  staggerMs?: number
  direction?: 'up' | 'down' | 'scale' | 'fade'
  threshold?: number
}) {
  return (
    <div className={className}>
      {children.map((child, idx) => (
        <ScrollReveal
          key={idx}
          delay={idx * staggerMs}
          direction={direction}
          threshold={threshold}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  )
}
