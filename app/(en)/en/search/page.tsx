import { SearchPage } from '@/components/pages/search-page'

export default async function EnglishSearchRoute({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  return <SearchPage locale="en" q={q} />
}
