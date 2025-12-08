import prisma from "@/lib/db"
import { DonationType } from "@prisma/client"

export async function getDonationStats() {
    const [totalResult, cashResult, packageResult, packageCount] = await Promise.all([
        // 1. Grand Total Amount
        prisma.donation.aggregate({
            _sum: { amount: true },
            _count: { id: true },
        }),
        // 2. Cash Total
        prisma.donation.aggregate({
            where: { type: "CASH" },
            _sum: { amount: true },
        }),
        // 3. Package Total Amount
        prisma.donation.aggregate({
            where: { type: "PACKAGE" },
            _sum: { amount: true },
        }),
        // 4. Package Count
        prisma.donation.count({
            where: { type: "PACKAGE" },
        })
    ])

    return {
        totalAmount: totalResult._sum.amount || 0,
        donors: totalResult._count.id || 0,
        cashTotal: cashResult._sum.amount || 0,
        packageTotal: packageResult._sum.amount || 0,
        packageCount: packageCount
    }
}

// Keep backward compatibility if needed, or update consumers
export const getTotalDonations = async () => {
    const stats = await getDonationStats()
    return {
        total: stats.totalAmount,
        donors: stats.donors
    }
}

export async function getAllDonations() {
    return await prisma.donation.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            donationPackage: true
        }
    })
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
