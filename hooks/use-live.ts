'use client'

import useSWR from 'swr'
import type { LiveBlog, Short, Story } from '@/lib/content/types'

export type ResolvedLiveEntry = LiveBlog['entries'][number] & { story?: Story | null; short?: Short | null }
export type ResolvedLiveBlog = Omit<LiveBlog, 'entries'> & { entries: ResolvedLiveEntry[] }

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Live feed failed: ${res.status}`)
  return (await res.json()).data as ResolvedLiveBlog | null
}

/** Shared key: header LIVE pill and homepage live block dedupe to one request. Phase 6 swaps polling for SSE. */
export function useLive() {
  return useSWR('/api/v1/live', fetcher, { refreshInterval: 20_000, revalidateOnFocus: true })
}
