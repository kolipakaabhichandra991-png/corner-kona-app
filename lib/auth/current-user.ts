import { getCurrentUser as getSessionUser } from './session'

export interface CurrentUser {
  id: string
  name: string
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const user = await getSessionUser()

  if (!user) return null

  return {
    id: user.id,
    name: user.name,
  }
}