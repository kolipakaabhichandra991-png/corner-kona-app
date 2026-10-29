'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  end: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

/**
 * Replicates the Purpose-Green PureCounter stats animation.
 * Counts up smoothly from 0 to the target number when scrolled into view.
 */
export function AnimatedCounter({
  end,
  prefix = '',
  suffix = '',
  duration = 1600,
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.3 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number | null = null
    let animationFrame: number

    const easeOutQuad = (t: number) => t * (2 - t)

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const easedProgress = easeOutQuad(progress)

      setCount(Math.floor(easedProgress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrame)
  }, [hasStarted, end, duration])

  return (
    <span ref={elementRef} className={className} suppressHydrationWarning>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}
