import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import prisma from "@/lib/db"
import { unstable_noStore as noStore } from "next/cache"

async function getAutoApproveSetting() {
    const setting = await prisma.systemSettings.findUnique({
        where: { key: "auto_approve" },
    })
    return setting?.value === "true"
}

export default async function SettingsPage() {
    noStore()
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
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage system configurations and environment preferences.</p>
            </div>

            <div className="grid gap-6">
                {/* Main Configuration Card */}
                <Card className="border-l-4 border-l-primary shadow-sm hover:shadow transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-xl">Automations</CardTitle>
                        <CardDescription>Configure how the system automatically handles tasks.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                            <Label htmlFor="auto-approve" className="flex flex-col space-y-1 cursor-pointer">
                                <span className="font-medium text-base">Auto-approve Requests</span>
                                <span className="font-normal text-sm text-muted-foreground">
                                    When enabled, new help requests are automatically marked as approved.
                                </span>
                            </Label>
                            <form action={toggleAutoApprove}>
                                <Switch id="auto-approve" defaultChecked={autoApprove} type="submit" />
                            </form>
                        </div>
                    </CardContent>
                </Card>

                {/* System Status / Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">System Status</CardTitle>
                        <CardDescription>Current environment information.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                            <div className="text-sm text-muted-foreground mb-1">Environment</div>
                            <div className="font-bold">Production</div>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                            <div className="text-sm text-muted-foreground mb-1">Database</div>
                            <div className="font-bold flex items-center justify-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Connected
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                            <div className="text-sm text-muted-foreground mb-1">API Status</div>
                            <div className="font-bold text-green-600">Healthy</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
