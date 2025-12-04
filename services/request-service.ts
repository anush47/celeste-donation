import prisma from "@/lib/db"

export async function getHelpRequests(approved: boolean = false) {
    if (approved) {
        return await prisma.helpRequest.findMany({
            where: {
                approved: true,
            },
        })
    }
    return await prisma.helpRequest.findMany()
}
