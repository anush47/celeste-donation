"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { MapPin, Phone, HeartHandshake } from "lucide-react"
import { format } from "date-fns"

interface HelpRequest {
    id: string
    name: string
    location: string
    needTypes: string[]
    description: string
    createdAt: string
    approved: boolean
    phone: string
}

interface RequestDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    request: HelpRequest | null
}

export function RequestDetailsDialog({ open, onOpenChange, request }: RequestDetailsDialogProps) {
    if (!request) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Request Details</DialogTitle>
                    <DialogDescription>
                        Review the details below and contact the person if you can help.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                            {request.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{request.name}</h3>
                            <div className="flex items-center text-muted-foreground text-sm">
                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                {request.location}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Posted on {format(new Date(request.createdAt), "MMM d, yyyy")}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Needs</Label>
                        <div className="flex flex-wrap gap-2">
                            {request.needTypes.map(type => (
                                <Badge key={type} variant="secondary">
                                    {type}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Description</Label>
                        <div className="text-sm text-foreground/90 bg-muted/20 p-3 rounded-md border text-sm leading-relaxed">
                            {request.description}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Contact Info</Label>
                        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 rounded-md border border-green-200 dark:border-green-900">
                            <Phone className="w-4 h-4" />
                            <span className="font-semibold">{request.phone}</span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button className="w-full h-12 text-base shadow-lg animate-in zoom-in duration-300" asChild>
                            <a href={`tel:${request.phone}`}>
                                <Phone className="w-5 h-5 mr-2" />
                                Call Now
                            </a>
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1">
                            <HeartHandshake className="w-3 h-3" />
                            Thank you for your generosity!
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
