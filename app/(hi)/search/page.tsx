import { SearchPage } from '@/components/pages/search-page'

export default async function HindiSearchRoute({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  return <SearchPage locale="hi" q={q} />
}
