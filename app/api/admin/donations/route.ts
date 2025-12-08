import { getAllDonations } from "@/services/donation-service"
import { apiResponse } from "@/lib/api-response"

export async function GET() {
    try {
        const donations = await getAllDonations()
        return apiResponse.success(donations)
    } catch (error) {
        return apiResponse.error("Failed to fetch donations", 500)
    }
}
