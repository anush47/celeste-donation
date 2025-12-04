import { apiResponse } from "@/lib/api-response"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session) {
        return apiResponse.error("Unauthorized", 401)
    }

    const setting = await prisma.systemSettings.findUnique({
        where: { key: "auto_approve" },
    })
    return apiResponse.success({ autoApprove: setting?.value === "true" })
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return apiResponse.error("Unauthorized", 401)
    }

    const { autoApprove } = await request.json()

    try {
        const setting = await prisma.systemSettings.upsert({
            where: { key: "auto_approve" },
            update: { value: String(autoApprove) },
            create: { key: "auto_approve", value: String(autoApprove) },
        })
        return apiResponse.success(setting, "Settings updated successfully")
    } catch (error) {
        return apiResponse.error("Failed to update settings", 500)
    }
}
