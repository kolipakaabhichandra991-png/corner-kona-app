import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { prisma } from '@/lib/prisma'

export const SESSION_COOKIE_NAME = 'ck_session'
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60 // 7 days

export interface SessionUser {
  id: string
  name: string
  email: string
}

export interface SessionPayload {
  sub: string
  name: string
  email: string
}

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('AUTH_SECRET environment variable is missing or insufficiently long')
  }
  return new TextEncoder().encode(secret)
}

/**
 * Creates a signed JWT session token valid for 7 days.
 */
export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    name: user.name,
    email: user.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey())
}

/**
 * Verifies and decodes a signed JWT session token.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (!payload.sub || typeof payload.email !== 'string') {
      return null
    }
    return {
      sub: payload.sub,
      name: typeof payload.name === 'string' ? payload.name : '',
      email: payload.email,
    }
  } catch {
    return null
  }
}

/**
 * Sets the httpOnly session cookie with the signed JWT token.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

/**
 * Clears the session cookie by removing it from the cookie store.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Helper to get the current authenticated user on the server.
 * Returns the user object { id, name, email } or null if unauthenticated.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
    if (!sessionCookie?.value) {
      return null
    }

    const payload = await verifySessionToken(sessionCookie.value)
    if (!payload?.sub) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return user
  } catch {
    return null
  }
}


