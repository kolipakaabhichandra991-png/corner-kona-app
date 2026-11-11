import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Handles newsletter signup with double opt‑in verification.
 * Generates a verification token, stores it with an expiry, and emails the user.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 422 })
  }

  // Generate a secure random token and set a 24‑hour expiry
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

  try {
    // Upsert subscriber – if it exists and is already verified, keep it verified.
    // Otherwise, store the new token and expiry.
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email, verificationToken: token, verificationExpiresAt: expiresAt },
      update: {
        ...(await prisma.newsletterSubscriber.findUnique({ where: { email } }))?.verified
          ? {}
          : { verificationToken: token, verificationExpiresAt: expiresAt },
      },
    })
    // Send verification email
    await sendVerificationEmail(email, token)
    return NextResponse.json({ data: { emailSent: true } }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}

/**
 * Verifies a newsletter subscription token.
 * Expects a query parameter `token`.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'missing_token' }, { status: 400 })
  }

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { verificationToken: token },
    })
    if (!subscriber) {
      return NextResponse.json({ error: 'invalid_token' }, { status: 404 })
    }
    if (subscriber.verificationExpiresAt && subscriber.verificationExpiresAt < new Date()) {
      return NextResponse.json({ error: 'expired_token' }, { status: 410 })
    }
    if (subscriber.verified) {
      return NextResponse.json({ data: { alreadyVerified: true } }, { status: 200 })
    }
    // Mark as verified and clear token/expiry
    await prisma.newsletterSubscriber.update({
      where: { email: subscriber.email },
      data: { verified: true, verificationToken: null, verificationExpiresAt: null },
    })
    return NextResponse.json({ data: { verified: true } }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
