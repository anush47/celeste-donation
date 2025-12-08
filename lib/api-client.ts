import { DonationType } from "@prisma/client"

type ApiResponse<T> = {
    success: boolean
    message?: string
    data?: T
    errors?: any
}

export const apiClient = {
    async getPackages() {
        const res = await fetch("/api/packages")
        const data = await res.json()
        return data as ApiResponse<any[]>
    },

    async getHelpRequests(approved: boolean = true) {
        const res = await fetch(`/api/requests?approved=${approved}`)
        const data = await res.json()
        return data as ApiResponse<any[]>
    },

    async submitHelpRequest(data: any) {
        const res = await fetch("/api/requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        return res.json() as Promise<ApiResponse<any>>
    },

    async getTotalDonations() {
        const res = await fetch("/api/donations/total")
        const data = await res.json()
        return data as ApiResponse<{ totalAmount: number; cashTotal: number; packageCount: number; packageTotal: number; donors: number; total?: number }>
    },

    async createPayment(data: {
        amount: number
        donorName: string
        donorPhone: string
        donorEmail?: string
        type: DonationType
        packageId?: string
    }) {
        const res = await fetch("/api/create-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        return res.json() as Promise<ApiResponse<any>>
    },
}
