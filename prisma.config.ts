import path from 'node:path'
import dotenv from 'dotenv'
import { defineConfig, env } from 'prisma/config'

// Load environment variables strictly from .env.local without creating a .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
})
