import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTotalDonations } from "@/services/donation-service"
import { getHelpRequests } from "@/services/request-service"
import { DollarSign, Users, FileText } from "lucide-react"

export default async function AdminDashboard() {
    const { total, donors } = await getTotalDonations()
    const requests = await getHelpRequests()
    const pendingRequests = requests.filter((r) => !r.approved).length

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{total.toLocaleString()} LKR</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{donors}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingRequests}</div>
                </CardContent>
            </Card>
        </div>
    )
}
