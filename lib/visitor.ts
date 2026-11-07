import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'

export const VISITOR_COOKIE = 'ck_visitor'
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export interface Visitor {
  id: string
  isNew: boolean
}

/** Anonymous visitor id (random UUID stored in an httpOnly cookie). Used for listening progress. */
export async function getVisitor(): Promise<Visitor> {
  const existing = (await cookies()).get(VISITOR_COOKIE)?.value
  if (existing && UUID.test(existing)) return { id: existing, isNew: false }
  return { id: crypto.randomUUID(), isNew: true }
}

/** Call on the response so a brand-new visitor id gets saved in their browser. */
export function withVisitorCookie<T extends NextResponse>(res: T, visitor: Visitor): T {
  if (visitor.isNew) {
    res.cookies.set(VISITOR_COOKIE, visitor.id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  }
  return res
}
