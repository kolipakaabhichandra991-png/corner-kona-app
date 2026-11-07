import { prisma } from '@/lib/db'

// Rate limit configurations
const LOGIN_MAX_FAILED_ATTEMPTS = 5
const LOGIN_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

const REGISTER_MAX_ATTEMPTS = 5
const REGISTER_WINDOW_MS = 60 * 60 * 1000 // 1 hour

/**
 * Extracts the client IP address from request headers.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim()
    if (firstIp) return firstIp
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) return cfIp.trim()

  return '127.0.0.1'
}

/**
 * Checks if login is blocked for the given email OR IP.
 * Blocked after 5 failed login attempts within 15 minutes.
 */
export async function checkLoginRateLimit(
  email: string,
  ip: string
): Promise<{ blocked: boolean; message?: string }> {
  const windowStart = new Date(Date.now() - LOGIN_WINDOW_MS)
  const cleanEmail = email.trim().toLowerCase()

  const [emailAttempts, ipAttempts] = await Promise.all([
    prisma.loginAttempt.count({
      where: {
        email: cleanEmail,
        type: 'login',
        createdAt: { gte: windowStart },
      },
    }),
    prisma.loginAttempt.count({
      where: {
        ip,
        type: 'login',
        createdAt: { gte: windowStart },
      },
    }),
  ])

  if (emailAttempts >= LOGIN_MAX_FAILED_ATTEMPTS || ipAttempts >= LOGIN_MAX_FAILED_ATTEMPTS) {
    return {
      blocked: true,
      message: 'Too many attempts. Please try again in 15 minutes.',
    }
  }

  return { blocked: false }
}

/**
 * Records a failed login attempt in the database (email, IP, timestamp).
 * Never stores or logs passwords.
 */
export async function recordFailedLoginAttempt(email: string, ip: string): Promise<void> {
  try {
    await prisma.loginAttempt.create({
      data: {
        email: email.trim().toLowerCase(),
        ip,
        type: 'login',
      },
    })
  } catch (err) {
    console.error('Error recording failed login attempt:', err)
  }
}

/**
 * Clears failed login attempts for an email upon successful login.
 */
export async function clearLoginAttempts(email: string): Promise<void> {
  try {
    await prisma.loginAttempt.deleteMany({
      where: {
        email: email.trim().toLowerCase(),
        type: 'login',
      },
    })
  } catch (err) {
    console.error('Error clearing login attempts:', err)
  }
}

/**
 * Checks if registration is blocked for the given IP (max 5 attempts per IP per hour).
 */
export async function checkRegisterRateLimit(
  ip: string
): Promise<{ blocked: boolean; message?: string }> {
  const windowStart = new Date(Date.now() - REGISTER_WINDOW_MS)

  const attempts = await prisma.loginAttempt.count({
    where: {
      ip,
      type: 'register',
      createdAt: { gte: windowStart },
    },
  })

  if (attempts >= REGISTER_MAX_ATTEMPTS) {
    return {
      blocked: true,
      message: 'Too many registration attempts. Please try again in an hour.',
    }
  }

  return { blocked: false }
}

/**
 * Records a registration attempt for an IP.
 */
export async function recordRegisterAttempt(email: string, ip: string): Promise<void> {
  try {
    await prisma.loginAttempt.create({
      data: {
        email: email.trim().toLowerCase(),
        ip,
        type: 'register',
      },
    })
  } catch (err) {
    console.error('Error recording register attempt:', err)
  }
}

const NEWSLETTER_MAX_ATTEMPTS = 5
const NEWSLETTER_WINDOW_MS = 60 * 60 * 1000 // 1 hour

/**
 * Checks if newsletter signup is blocked for the given IP (max 5 per hour).
 */
export async function checkNewsletterRateLimit(
  ip: string
): Promise<{ blocked: boolean; message?: string }> {
  const windowStart = new Date(Date.now() - NEWSLETTER_WINDOW_MS)

  const attempts = await prisma.loginAttempt.count({
    where: {
      ip,
      type: 'newsletter',
      createdAt: { gte: windowStart },
    },
  })

  if (attempts >= NEWSLETTER_MAX_ATTEMPTS) {
    return {
      blocked: true,
      message: 'Too many signup attempts. Please try again in an hour.',
    }
  }

  return { blocked: false }
}

/**
 * Records a newsletter signup attempt for an IP.
 */
export async function recordNewsletterAttempt(ip: string): Promise<void> {
  try {
    await prisma.loginAttempt.create({
      data: {
        ip,
        type: 'newsletter',
      },
    })
  } catch (err) {
    console.error('Error recording newsletter attempt:', err)
  }
}

