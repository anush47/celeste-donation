import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import prisma from "@/lib/db"

async function getAutoApproveSetting() {
    const setting = await prisma.systemSettings.findUnique({
        where: { key: "auto_approve" },
    })
    return setting?.value === "true"
}

export default async function SettingsPage() {
    const autoApprove = await getAutoApproveSetting()

    async function toggleAutoApprove() {
        "use server"
        const current = await getAutoApproveSetting()
        await prisma.systemSettings.upsert({
            where: { key: "auto_approve" },
            update: { value: String(!current) },
            create: { key: "auto_approve", value: String(!current) },
        })
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="auto-approve" className="flex flex-col space-y-1">
                            <span>Auto-approve Requests</span>
                            <span className="font-normal text-sm text-muted-foreground">
                                Automatically approve new help requests upon submission.
                            </span>
                        </Label>
                        <form action={toggleAutoApprove}>
                            <Switch id="auto-approve" defaultChecked={autoApprove} type="submit" />
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
