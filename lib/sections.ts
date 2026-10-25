import type { CategoryKey } from '@/lib/content/types'

/** Static class strings so Tailwind can see them. One personality per section. */
export const sectionStyle: Record<CategoryKey, { bg: string; text: string; border: string; ring: string }> = {
  sports: { bg: 'bg-sports', text: 'text-sports', border: 'border-sports', ring: 'ring-sports' },
  entertainment: {
    bg: 'bg-entertainment',
    text: 'text-entertainment',
    border: 'border-entertainment',
    ring: 'ring-entertainment',
  },
  geopolitics: { bg: 'bg-geopolitics', text: 'text-geopolitics', border: 'border-geopolitics', ring: 'ring-geopolitics' },
  bhakti: { bg: 'bg-bhakti', text: 'text-bhakti', border: 'border-bhakti', ring: 'ring-bhakti' },
  lifestyle: { bg: 'bg-lifestyle', text: 'text-lifestyle', border: 'border-lifestyle', ring: 'ring-lifestyle' },
  news: { bg: 'bg-news', text: 'text-news', border: 'border-news', ring: 'ring-news' },
  deshKiCharcha: {
    bg: 'bg-desh-ki-charcha',
    text: 'text-desh-ki-charcha',
    border: 'border-desh-ki-charcha',
    ring: 'ring-desh-ki-charcha',
  },
  genZ: { bg: 'bg-gen-z', text: 'text-gen-z', border: 'border-gen-z', ring: 'ring-gen-z' },
  ckSpecial: {
    bg: 'bg-ck-special',
    text: 'text-ck-special',
    border: 'border-ck-special',
    ring: 'ring-ck-special',
  },
  gallery: { bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500', ring: 'ring-rose-500' },
  techTalk: { bg: 'bg-sky-500', text: 'text-sky-500', border: 'border-sky-500', ring: 'ring-sky-500' },
  scienceGyan: { bg: 'bg-teal-500', text: 'text-teal-500', border: 'border-teal-500', ring: 'ring-teal-500' },
  sehat: { bg: 'bg-lime-500', text: 'text-lime-500', border: 'border-lime-500', ring: 'ring-lime-500' },
}
