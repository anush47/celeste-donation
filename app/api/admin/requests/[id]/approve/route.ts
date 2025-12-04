import { apiResponse } from "@/lib/api-response"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return apiResponse.error("Unauthorized", 401)
    }

    const { id } = await params

    try {
        const updatedRequest = await prisma.helpRequest.update({
            where: { id },
            data: { approved: true },
        })
        return apiResponse.success(updatedRequest, "Request approved successfully")
    } catch (error) {
        return apiResponse.error("Failed to approve request", 500)
    }
}
