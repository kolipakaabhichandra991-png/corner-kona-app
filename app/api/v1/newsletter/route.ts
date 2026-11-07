import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Validates the email and saves it (the same email twice is fine: stored once). */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 422 })
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email },
      update: {},
    })
    return NextResponse.json({ data: { subscribed: true } }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
