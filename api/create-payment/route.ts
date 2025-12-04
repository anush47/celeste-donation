import { createDonation, processPayment } from "@/services/donation-service"
import { DonationType } from "@prisma/client"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { amount, donorName, donorPhone, donorEmail, type, packageId } = body

        // Validate required fields
        if (!amount || !donorName || !donorPhone || !type) {
            return Response.json({ error: "Missing required fields" }, { status: 400 })
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

            return Response.json({ success: true, donation, transactionId: paymentResult.transactionId })
        } else {
            return Response.json({ error: "Payment failed" }, { status: 500 })
        }
    } catch (error) {
        return Response.json({ error: "Internal server error" }, { status: 500 })
    }
}
