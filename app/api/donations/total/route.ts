import { getTotalDonations } from "@/services/donation-service"
import { apiResponse } from "@/lib/api-response"

export async function GET() {
    try {
        const totals = await getTotalDonations()
        return apiResponse.success(totals)
    } catch (error) {
        return apiResponse.error("Failed to fetch donation totals", 500)
    }
}
