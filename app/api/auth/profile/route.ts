import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, createSessionToken, setSessionCookie } from '@/lib/auth/session'

const updateProfileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
  phone: z.union([z.string().trim().max(20, 'Phone number is too long'), z.null()]).optional(),
}).strict()

export async function GET() {
  try {
    const sessionUser = await getCurrentUser()
    if (!sessionUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const sessionUser = await getCurrentUser()
    if (!sessionUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let body: unknown
    try { body = await request.json() }
    catch { return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 }) }
    const result = updateProfileSchema.safeParse(body)
    if (!result.success) return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Invalid profile data' }, { status: 400 })
    const user = await prisma.user.update({
      where: { id: sessionUser.id },
      data: {
        name: result.data.name,
        ...(result.data.phone !== undefined ? { phone: result.data.phone || null } : {}),
      },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    })
    // Refresh the signed session after a name change.
    const token = await createSessionToken({ id: user.id, name: user.name, email: user.email })
    await setSessionCookie(token)
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Profile PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
