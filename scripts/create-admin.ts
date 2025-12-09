import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    const args = process.argv.slice(2)
    const username = process.env.ADMIN_USERNAME || args[0]
    const password = process.env.ADMIN_PASSWORD || args[1]

    if (!username || !password) {
        console.error("Usage: npx tsx scripts/create-admin.ts <username> <password>")
        console.error("OR set ADMIN_USERNAME and ADMIN_PASSWORD environment variables")
        process.exit(1)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const admin = await prisma.admin.upsert({
            where: { username },
            update: { password: hashedPassword },
            create: {
                username,
                password: hashedPassword,
            },
        })
        console.log(`Admin user '${admin.username}' created successfully.`)
    } catch (error) {
        console.error("Error creating admin user:", error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
