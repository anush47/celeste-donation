import prisma from "@/lib/db"

export async function getPackages() {
    return await prisma.donationPackage.findMany({
        include: {
            items: true,
        },
    })
}
