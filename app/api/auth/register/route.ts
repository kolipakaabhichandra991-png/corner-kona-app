import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth/password'
import { createSessionToken, setSessionCookie } from '@/lib/auth/session'
import { registerSchema } from '@/lib/auth/validation'
import {
  getClientIp,
  checkRegisterRateLimit,
  recordRegisterAttempt,
} from '@/lib/auth/rate-limit'

export async function POST(request: Request) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body' },
        { status: 400 }
      )
    }

    const ip = getClientIp(request)

    // Rate limit: 5 registration attempts per IP per hour
    const rateLimit = await checkRegisterRateLimit(ip)
    if (rateLimit.blocked) {
      return NextResponse.json(
        { error: rateLimit.message || 'Too many registration attempts. Please try again in an hour.' },
        { status: 429 }
      )
    }

    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      // Record attempt to count toward the 5/hour limit
      const rawEmail = typeof body === 'object' && body && 'email' in body && typeof (body as any).email === 'string'
        ? (body as any).email
        : ''
      await recordRegisterAttempt(rawEmail, ip)

      const firstIssue = validationResult.error.issues[0]
      const errorMessage = firstIssue ? firstIssue.message : 'Invalid registration data'
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    const { name, email, password, phone } = validationResult.data

    // Record the attempt for this IP
    await recordRegisterAttempt(email, ip)

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash the password with bcrypt (cost 12)
    const passwordHash = await hashPassword(password)

    // Create the user in Neon PostgreSQL
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    // Sign session JWT and set httpOnly cookie
    const token = await createSessionToken(newUser)
    await setSessionCookie(token)

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}

