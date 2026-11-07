import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function getSafeNextPath(value: string | null, origin: string) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return '/'
  }

  const destination = new URL(value, origin)
  return destination.origin === origin ? `${destination.pathname}${destination.search}${destination.hash}` : '/'
}

function getLoginPath(nextPath: string) {
  return nextPath === '/en' || nextPath.startsWith('/en/') ? '/en/login' : '/login'
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const nextPath = getSafeNextPath(requestUrl.searchParams.get('next'), requestUrl.origin)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(new URL(nextPath, requestUrl.origin))
    }
  }

  const loginUrl = new URL(getLoginPath(nextPath), requestUrl.origin)
  loginUrl.searchParams.set('authError', 'google_signin_failed')
  return NextResponse.redirect(loginUrl)
}
