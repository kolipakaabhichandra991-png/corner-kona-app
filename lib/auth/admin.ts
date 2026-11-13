import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

export interface AdminSession {
  user: string
  role: string
}

const ADMIN_COOKIE_NAME = 'corner_kona_admin_token'
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getAdminSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('AUTH_SECRET environment variable is missing or insufficiently long')
  }
  // Use a different context string so admin and user tokens are incompatible
  return new TextEncoder().encode(secret + ':admin')
}

/** Creates a signed admin JWT and sets the httpOnly cookie. */
export async function createAdminSession(username: string): Promise<void> {
  const token = await new SignJWT({ role: 'Super Admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getAdminSecretKey())

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  })
}

/** Clears the admin session cookie. */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}

/**
 * Reads and verifies the signed admin JWT cookie.
 * Returns the AdminSession or null if absent/invalid/expired.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getAdminSecretKey())
    if (typeof payload.sub !== 'string' || !payload.sub) return null
    return {
      user: payload.sub,
      role: typeof payload.role === 'string' ? payload.role : 'Super Admin',
    }
  } catch {
    return null
  }
}
