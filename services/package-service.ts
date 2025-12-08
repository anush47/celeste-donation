import prisma from "@/lib/db"

export async function getPackages() {
    const packages = await prisma.donationPackage.findMany({
        include: {
            items: true,
            _count: {
                select: { donations: true }
            }
        },
    })

    return packages.map(pkg => ({
        ...pkg,
        _count: undefined, // specific cleanup if we want strictly clean objects, but spreading works too. 
        // Better to just return the mapped object clearly
        donationCount: pkg._count.donations
    }))
}
