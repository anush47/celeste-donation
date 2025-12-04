import { getTotalDonations } from "@/services/donation-service"

export async function GET() {
    const totals = await getTotalDonations()
    return Response.json(totals)
}
