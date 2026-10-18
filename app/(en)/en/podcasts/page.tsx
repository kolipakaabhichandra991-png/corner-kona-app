import { PodcastsPage } from '@/components/pages/podcasts-page'

export default async function EnglishPodcastsRoute({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; kind?: string }>
}) {
  const { topic, kind } = await searchParams
  return <PodcastsPage locale="en" topic={topic} kind={kind} />
}
