'use client'

import { Children, useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

/** Swipe-first horizontal rail with CSS scroll-snap; arrows appear on pointer devices. */
export function Carousel({
  children,
  label,
  prev,
  next,
}: {
  children: React.ReactNode
  label: string
  prev: string
  next: string
}) {
  const ref = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
  }, [])

  useEffect(() => {
    update()
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [update])

  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <div className="group/carousel relative mx-auto w-full max-w-7xl">
      <ul
        ref={ref}
        onScroll={update}
        aria-label={label}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 md:scroll-px-6 md:gap-4 md:px-6"
      >
        {Children.map(children, (child) => (
          <li className="shrink-0 snap-start">{child}</li>
        ))}
      </ul>
      <div className="pointer-events-none absolute inset-y-0 right-0 left-0 hidden items-center justify-between px-1 md:flex">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => scroll(-1)}
          disabled={edges.start}
          aria-label={prev}
          className="pointer-events-auto size-10 rounded-full shadow-xl transition-all duration-300 hover:scale-110 active:scale-90 hover:bg-primary hover:text-primary-foreground disabled:opacity-0 cursor-pointer"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => scroll(1)}
          disabled={edges.end}
          aria-label={next}
          className="pointer-events-auto size-10 rounded-full shadow-xl transition-all duration-300 hover:scale-110 active:scale-90 hover:bg-primary hover:text-primary-foreground disabled:opacity-0 cursor-pointer"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
