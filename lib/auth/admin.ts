import { cookies } from 'next/headers'

export interface AdminSession {
  user: string
  role: string
}

/**
 * Same check the existing GET /api/admin/auth uses: reads the admin cookie and decodes it.
 * NOTE: that cookie is unsigned (anyone can forge it). Replace this function when the team
 * builds real admin authentication; every admin route calls only this function.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get('corner_kona_admin_token')?.value
  if (!token) return null
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'))
    if (typeof decoded?.user === 'string' && decoded.user && typeof decoded?.role === 'string') {
      return { user: decoded.user, role: decoded.role }
    }
    return null
  } catch {
    return null
  }
}
