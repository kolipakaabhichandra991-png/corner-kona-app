import { NextResponse } from 'next/server'
import { getHome } from '@/lib/content/repository'

export async function GET(request: Request) {
  const locale = new URL(request.url).searchParams.get('locale') === 'en' ? 'en' : 'hi'
  return NextResponse.json({ data: await getHome(locale) })
}
