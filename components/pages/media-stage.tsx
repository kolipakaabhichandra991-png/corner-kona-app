import Image from 'next/image'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Artwork + play affordance. Real players (HLS/audio) arrive with the media pipeline. */
export function MediaStage({
  image,
  label,
  note,
  ratio = 'aspect-square',
  priority,
}: {
  image: string
  label: string
  note: string
  ratio?: string
  priority?: boolean
}) {
  return (
    <figure className={cn('relative isolate overflow-hidden rounded-3xl bg-ink text-ink-foreground', ratio)}>
      <Image
        src={image || '/placeholder.svg'}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 1024px) 560px, 100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-5">
        <button
          type="button"
          disabled
          aria-label={label}
          className="grid size-14 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg disabled:cursor-not-allowed"
        >
          <Play className="size-6 translate-x-px fill-current" aria-hidden="true" />
        </button>
        <span className="text-sm font-semibold text-ink-foreground/80">{note}</span>
      </figcaption>
    </figure>
  )
}
