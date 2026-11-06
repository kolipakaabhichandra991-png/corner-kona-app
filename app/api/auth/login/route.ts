import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword, dummyPasswordCompare } from '@/lib/auth/password'
import { createSessionToken, setSessionCookie } from '@/lib/auth/session'
import { loginSchema } from '@/lib/auth/validation'

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

    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0]
      const errorMessage = firstIssue ? firstIssue.message : 'Invalid login credentials'
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Run dummy comparison to protect against timing-based email enumeration
      await dummyPasswordCompare(password)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Sign session JWT and set httpOnly cookie
    const token = await createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
    })
    await setSessionCookie(token)

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
