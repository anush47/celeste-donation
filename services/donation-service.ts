import prisma from "@/lib/db"
import { DonationType } from "@prisma/client"

export async function getTotalDonations() {
    const result = await prisma.donation.aggregate({
        _sum: {
            amount: true,
        },
        _count: {
            id: true,
        },
    })

    return {
        total: result._sum.amount || 0,
        donors: result._count.id || 0,
    }
}

export async function createDonation(data: {
    amount: number
    donorName: string
    donorPhone: string
    donorEmail?: string
    type: DonationType
    packageId?: string
}) {
    return await prisma.donation.create({
        data,
    })
}

export async function processPayment(amount: number) {
    // Mock payment processing
    // In a real app, this would integrate with a payment gateway
    return {
        success: true,
        transactionId: `txn_${Date.now()}`,
    }
}
