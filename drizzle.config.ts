import { CommonConfig } from '@/config/common'
import { defineConfig } from 'drizzle-kit'
export default defineConfig({
    schema: "./src/schema/*",
    out: "./drizzle",
    driver: 'pg',
    dbCredentials: {
        connectionString: CommonConfig.DATABASE_URL || ''
    },
    verbose: true,
    strict: true,
})