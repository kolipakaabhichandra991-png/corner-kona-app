import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Admin credentials
const VALID_USERS: Record<string, string> = {
  admin: 'admin123',
  cornerkona: 'kona@2026',
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 })
    }

    const expectedPassword = VALID_USERS[username.trim().toLowerCase()]
    if (!expectedPassword || expectedPassword !== password.trim()) {
      return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 })
    }

    // Set cookie
    const cookieStore = await cookies()
    const sessionToken = Buffer.from(
      JSON.stringify({
        user: username,
        role: 'Super Admin',
        loginTime: Date.now(),
      }),
    ).toString('base64')

    cookieStore.set('corner_kona_admin_token', sessionToken, {
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    })

    return NextResponse.json({
      success: true,
      user: {
        username,
        role: 'Super Admin',
        name: 'Corner Kona Administrator',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Authentication error' }, { status: 500 })
  }
}

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('corner_kona_admin_token')?.value

  if (!token) {
    return NextResponse.json({ authenticated: false })
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'))
    return NextResponse.json({
      authenticated: true,
      user: decoded.user,
      role: decoded.role,
    })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('corner_kona_admin_token')
  return NextResponse.json({ success: true, message: 'Logged out successfully' })
}
