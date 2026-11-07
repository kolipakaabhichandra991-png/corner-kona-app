import readline from 'node:readline'
import path from 'node:path'
import dotenv from 'dotenv'
import { prisma } from '../lib/db'
import { hashPassword } from '../lib/auth/password'

// Ensure .env.local is loaded
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

function askHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const stdin = process.stdin
    process.stdout.write(question)

    let password = ''
    const onData = (char: Buffer) => {
      const str = char.toString('utf-8')
      for (const ch of str) {
        if (ch === '\n' || ch === '\r' || ch === '\u0004') {
          stdin.removeListener('data', onData)
          if (stdin.isTTY) stdin.setRawMode(false)
          rl.close()
          process.stdout.write('\n')
          resolve(password)
          return
        } else if (ch === '\u0003') {
          process.stdout.write('\nCancelled.\n')
          process.exit(1)
        } else if (ch === '\b' || ch === '\x7f') {
          if (password.length > 0) {
            password = password.slice(0, -1)
            process.stdout.write('\b \b')
          }
        } else {
          password += ch
          process.stdout.write('*')
        }
      }
    }

    if (stdin.isTTY) {
      stdin.setRawMode(true)
      stdin.resume()
      stdin.on('data', onData)
    } else {
      rl.question('', (ans) => {
        rl.close()
        resolve(ans.trim())
      })
    }
  })
}

async function main() {
  console.log('=== Corner Kona - Create / Update Admin Account ===\n')

  const usernameInput = await ask('Enter admin username: ')
  if (!usernameInput) {
    console.error('Error: Username cannot be empty.')
    process.exit(1)
  }

  const username = usernameInput.toLowerCase()

  const password = await askHidden('Enter admin password: ')
  if (!password || password.length < 8) {
    console.error('Error: Password must be at least 8 characters long.')
    process.exit(1)
  }

  const confirmPassword = await askHidden('Confirm admin password: ')
  if (password !== confirmPassword) {
    console.error('Error: Passwords do not match.')
    process.exit(1)
  }

  // Hash password using bcryptjs with cost factor 12
  const passwordHash = await hashPassword(password)

  const existingAdmin = await prisma.admin.findUnique({
    where: { username },
  })

  if (existingAdmin) {
    const answer = await ask(`Admin "${username}" already exists. Update password? (y/N): `)
    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
      console.log('Aborted.')
      process.exit(0)
    }

    await prisma.admin.update({
      where: { username },
      data: { passwordHash },
    })

    console.log(`\n✓ Password for admin "${username}" updated successfully.`)
  } else {
    await prisma.admin.create({
      data: {
        username,
        passwordHash,
      },
    })

    console.log(`\n✓ Admin account "${username}" created successfully.`)
  }
}

main()
  .catch((err) => {
    console.error('Failed to create admin:', err.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => {})
    process.exit(0)
  })
