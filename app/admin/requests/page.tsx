import { getHelpRequests } from "@/services/request-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function RequestsPage() {
    const requests = await getHelpRequests()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Help Requests</h1>
            <div className="grid gap-4">
                {requests.map((request) => (
                    <Card key={request.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">{request.name}</CardTitle>
                            <Badge variant={request.approved ? "default" : "secondary"}>
                                {request.approved ? "Approved" : "Pending"}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">{request.location}</p>
                            <p className="mb-4">{request.description}</p>
                            <div className="flex gap-2">
                                {!request.approved && (
                                    <form
                                        action={async () => {
                                            "use server"
                                            // Call API to approve
                                            // implementation details in next step
                                        }}
                                    >
                                        <Button size="sm">Approve</Button>
                                    </form>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
