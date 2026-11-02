import { PodcastsPage } from '@/components/pages/podcasts-page'

export default async function HindiPodcastsRoute({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; kind?: string; release?: string }>
}) {
  const { topic, kind, release } = await searchParams
  return <PodcastsPage locale="hi" topic={topic} kind={kind} release={release} />
}
