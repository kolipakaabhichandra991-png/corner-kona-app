import bcrypt from 'bcryptjs'

const BCRYPT_SALT_ROUNDS = 12

// Pre-computed bcrypt hash (cost 12) used to equalize response timing
// when a user is not found, mitigating timing-based user enumeration attacks.
const DUMMY_HASH = '$2b$12$xrEJRuE5pfsbDFDMngmPAeB5PusZ0X6ySYJ8n4.r6b4MbNEh/HijC'

/**
 * Hash a plain text password using bcrypt with a cost factor of 12.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
}

/**
 * Compare a plain text password against a stored bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Perform a dummy comparison against a cost-12 hash to prevent timing attacks
 * when a user is not found during login.
 */
export async function dummyPasswordCompare(password: string): Promise<boolean> {
  return bcrypt.compare(password, DUMMY_HASH)
}
