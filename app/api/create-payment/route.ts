import { createDonation, processPayment } from "@/services/donation-service"
import { DonationType } from "@prisma/client"
import { apiResponse } from "@/lib/api-response"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { amount, donorName, donorPhone, donorEmail, type, packageId } = body

        // Validate required fields
        if (!amount || !donorName || !donorPhone || !type) {
            return apiResponse.error("Missing required fields", 400)
        }

        // Process payment (mock)
        const paymentResult = await processPayment(amount)

        if (paymentResult.success) {
            // Create donation record
            const donation = await createDonation({
                amount,
                donorName,
                donorPhone,
                donorEmail,
                type: type as DonationType,
                packageId,
            })

            return apiResponse.success(
                { donation, transactionId: paymentResult.transactionId },
                "Donation successful",
            )
        } else {
            return apiResponse.error("Payment failed", 500)
        }
    } catch (error) {
        return apiResponse.error("Internal server error", 500)
    }
}
