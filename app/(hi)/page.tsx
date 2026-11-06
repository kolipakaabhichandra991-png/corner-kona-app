import { redirect } from 'next/navigation'
import { HomePage } from '@/components/home/home-page'

export const revalidate = 300

interface PageProps {
  searchParams?: Promise<{ lang?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  if (params?.lang === 'hi') {
    return <HomePage locale="hi" />
  }
  redirect('/en')
}
