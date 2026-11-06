import { NextResponse } from 'next/server'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Phase 1 stub: validates input. Persistence lands with the database in Phase 2. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 422 })
  }
  return NextResponse.json({ data: { subscribed: true } }, { status: 201 })
}
