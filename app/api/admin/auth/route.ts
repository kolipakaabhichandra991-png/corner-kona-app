import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword, dummyPasswordCompare } from '@/lib/auth/password'
import {
  createAdminSessionToken,
  setAdminSessionCookie,
  clearAdminSessionCookie,
  getAdminSession,
} from '@/lib/auth/admin'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const cleanUsername = username.trim().toLowerCase()

    // Query from the separate Admin table
    const admin = await prisma.admin.findUnique({
      where: { username: cleanUsername },
    })

    if (!admin) {
      // Run dummy comparison to prevent timing-based username enumeration
      await dummyPasswordCompare(password)
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    const isPasswordValid = await verifyPassword(password, admin.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Create cryptographically signed JWT token with jose and set httpOnly cookie
    const token = await createAdminSessionToken(admin)
    await setAdminSessionCookie(token)

    return NextResponse.json({
      success: true,
      user: {
        username: admin.username,
        role: 'Super Admin',
        name: 'Corner Kona Administrator',
      },
    })
  } catch (err: any) {
    console.error('Admin authentication error:', err)
    return NextResponse.json(
      { success: false, error: 'Authentication error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await getAdminSession()

  if (!session) {
    return NextResponse.json({ authenticated: false })
  }

  return NextResponse.json({
    authenticated: true,
    user: session.username,
    role: session.role,
  })
}

export async function DELETE() {
  await clearAdminSessionCookie()
  return NextResponse.json({ success: true, message: 'Logged out successfully' })
}
