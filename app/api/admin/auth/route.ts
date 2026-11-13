import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createAdminSession, clearAdminSession, getAdminSession } from '@/lib/auth/admin'

/**
 * Loads admin credentials from ADMIN_CREDENTIALS env var.
 * Format: "username1:hash1,username2:hash2"
 * Falls back to empty map if the variable is absent (login will always fail).
 */
function loadAdminCredentials(): Map<string, string> {
  const raw = process.env.ADMIN_CREDENTIALS ?? ''
  const map = new Map<string, string>()
  for (const entry of raw.split(',')) {
    const colonIdx = entry.indexOf(':')
    if (colonIdx < 1) continue
    const user = entry.slice(0, colonIdx).trim().toLowerCase()
    const hash = entry.slice(colonIdx + 1).trim()
    if (user && hash) map.set(user, hash)
  }
  return map
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 },
      )
    }

    const credentials = loadAdminCredentials()
    const normalizedUser = (username as string).trim().toLowerCase()
    const hash = credentials.get(normalizedUser)

    // Always run bcrypt compare to avoid timing attacks even when user not found
    const isValid = hash ? await bcrypt.compare((password as string).trim(), hash) : false

    if (!hash || !isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 },
      )
    }

    await createAdminSession(normalizedUser)

    return NextResponse.json({
      success: true,
      user: {
        username: normalizedUser,
        role: 'Super Admin',
        name: 'Corner Kona Administrator',
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Authentication error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ authenticated: false })
  }
  return NextResponse.json({
    authenticated: true,
    user: session.user,
    role: session.role,
  })
}

export async function DELETE() {
  await clearAdminSession()
  return NextResponse.json({ success: true, message: 'Logged out successfully' })
}
