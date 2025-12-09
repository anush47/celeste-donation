import { getHelpRequests } from "@/services/request-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import prisma from "@/lib/db"
import { revalidatePath, unstable_noStore as noStore } from "next/cache"
import { Check, Clock, MapPin } from "lucide-react"

export default async function RequestsPage() {
    noStore()
    const requests = await getHelpRequests()

    async function approveRequest(formData: FormData) {
        "use server"
        const id = formData.get("id") as string
        if (id) {
            await prisma.helpRequest.update({
                where: { id },
                data: { approved: true },
            })
            revalidatePath("/admin/requests")
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Help Requests</h1>
                <p className="text-muted-foreground">Manage and approve assistance requests from the community.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Requests</CardTitle>
                    <CardDescription>A list of all help requests submitted by users.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Name / Phone</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Needs</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((request: any) => (
                                <TableRow key={request.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{request.name}</span>
                                            <span className="text-xs text-muted-foreground">{request.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            {request.location}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {request.needTypes.map((need: any) => (
                                                <Badge key={need} variant="outline" className="text-xs">
                                                    {need}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={request.approved ? "default" : "secondary"}>
                                            {request.approved ? "Approved" : "Pending"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {!request.approved && (
                                            <form action={approveRequest}>
                                                <input type="hidden" name="id" value={request.id} />
                                                <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
                                                    <Check className="w-4 h-4 mr-1" />
                                                    Approve
                                                </Button>
                                            </form>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {requests.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No help requests found.
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
