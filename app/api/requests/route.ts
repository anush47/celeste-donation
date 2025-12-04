import { getHelpRequests } from "@/services/request-service"
import { apiResponse } from "@/lib/api-response"
import prisma from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const approved = searchParams.get("approved") === "true"

  try {
    const requests = await getHelpRequests(approved)
    return apiResponse.success(requests)
  } catch (error) {
    return apiResponse.error("Failed to fetch requests", 500)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, location, needTypes, description } = body

    // Basic validation
    if (!name || !phone || !location || !needTypes || !description) {
      return apiResponse.error("Missing required fields", 400)
    }

    // Check auto-approve setting
    const setting = await prisma.systemSettings.findUnique({
      where: { key: "auto_approve" },
    })
    const approved = setting?.value === "true"

    const newRequest = await prisma.helpRequest.create({
      data: {
        name,
        phone,
        location,
        needTypes,
        description,
        approved,
      },
    })

    return apiResponse.success(newRequest, "Request submitted successfully", 201)
  } catch (error) {
    console.error("Error submitting request:", error)
    return apiResponse.error("Failed to submit request", 500)
  }
}
