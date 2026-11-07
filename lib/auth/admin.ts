import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { prisma } from '@/lib/db'

export const ADMIN_COOKIE_NAME = 'ck_admin_session'
export const ADMIN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days

export interface AdminSessionPayload {
  sub: string
  username: string
  role: string
}

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('AUTH_SECRET environment variable is missing or insufficiently long')
  }
  return new TextEncoder().encode(secret)
}

/**
 * Creates a signed JWT session token for an authenticated admin (valid for 7 days).
 */
export async function createAdminSessionToken(admin: { id: string; username: string }): Promise<string> {
  return new SignJWT({
    username: admin.username,
    role: 'Super Admin',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(admin.id)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey())
}

/**
 * Verifies and decodes a signed admin session JWT.
 * Returns null if token is missing, tampered with, expired, or invalid.
 */
export async function verifyAdminSessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (!payload.sub || typeof payload.username !== 'string') {
      return null
    }
    return {
      sub: payload.sub,
      username: payload.username,
      role: typeof payload.role === 'string' ? payload.role : 'Super Admin',
    }
  } catch {
    return null
  }
}

/**
 * Sets the httpOnly admin session cookie.
 */
export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  })
}

/**
 * Clears the admin session cookie on logout.
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}

/**
 * Helper to get and verify the current admin session from incoming cookies.
 * Verifies JWT signature and checks admin existence in the Admin table.
 * Returns the admin payload or null if unauthorized.
 */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
    if (!token) return null

    const payload = await verifyAdminSessionToken(token)
    if (!payload?.sub) return null

    const admin = await prisma.admin.findUnique({
      where: { id: payload.sub },
      select: { id: true, username: true },
    })
    if (!admin) return null

    return {
      sub: admin.id,
      username: admin.username,
      role: payload.role,
    }
  } catch {
    return null
  }
}
