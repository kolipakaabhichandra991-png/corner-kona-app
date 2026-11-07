import { headers } from 'next/headers'

export interface CurrentUser {
  id: string
  name: string
}

/**
 * The ONE place that answers "who is logged in?".
 *
 * The login system is not merged yet, so for now this returns null (nobody is logged in),
 * which makes every comment / like / report route answer 401 "login_required".
 *
 * For LOCAL testing only: set ALLOW_DEV_USER=true in .env.local and a fake test user is returned.
 * This never works in production (NODE_ENV === 'production').
 *
 * TODO (login developer): replace the body with the real session lookup and return { id, name }.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEV_USER === 'true') {
    const h = await headers()
    // Lets the test script pretend to be logged out.
    if (h.get('x-dev-logged-out') === '1') return null
    return { id: 'dev-user-1', name: 'Dev Tester' }
  }
  return null
}
