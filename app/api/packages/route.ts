import { getPackages } from "@/services/package-service"
import { apiResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const packages = await getPackages()
    return apiResponse.success(packages)
  } catch (error) {
    return apiResponse.error("Failed to fetch packages", 500)
  }
}
