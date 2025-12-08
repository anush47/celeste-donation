import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getDonationStats, getAllDonations } from "@/services/donation-service"
import { getPackages } from "@/services/package-service"
import { getHelpRequests } from "@/services/request-service"
import { DollarSign, Users, FileText, Package, CreditCard, Calendar } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function AdminDashboard() {
    const stats = await getDonationStats()
    const allDonations = await getAllDonations()
    const packages = await getPackages()
    const requests = await getHelpRequests()
    const pendingRequests = requests.filter((r) => !r.approved).length

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalAmount.toLocaleString()} LKR</div>
                        <p className="text-xs text-muted-foreground">Across all channels</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cash Donations</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.cashTotal.toLocaleString()} LKR</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Packages Donated</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.packageCount}</div>
                        <p className="text-xs text-muted-foreground">Valued at {stats.packageTotal.toLocaleString()} LKR</p>
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

            {/* Package Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Package Breakdown</CardTitle>
                    <CardDescription>Donation counts by package type.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        {packages.map((pkg) => (
                            <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{pkg.name}</p>
                                    <p className="text-xs text-muted-foreground">{pkg.total.toLocaleString()} LKR / unit</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-lg px-3 py-1">
                                        {pkg.donationCount || 0}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Donations Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Donations</CardTitle>
                    <CardDescription>A detailed list of all donations including cash and packages.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Donor</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allDonations.map((donation) => (
                                <TableRow key={donation.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            {new Date(donation.createdAt).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{donation.donorName}</span>
                                            <span className="text-xs text-muted-foreground">{donation.donorPhone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={donation.type === "CASH" ? "secondary" : "default"}>
                                            {donation.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {donation.type === "PACKAGE" && donation.donationPackage ? (
                                            <div className="flex items-center gap-2">
                                                <Package className="w-4 h-4 text-primary" />
                                                <span>{donation.donationPackage.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        {donation.amount.toLocaleString()} LKR
                                    </TableCell>
                                </TableRow>
                            ))}
                            {allDonations.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No donations found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
