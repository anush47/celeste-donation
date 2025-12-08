"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Check, User, FileText, Phone } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { cn } from "@/lib/utils"

const NEED_TYPES = ["Food & Water", "Medical Supplies", "Shelter & Repairs", "Clothing", "Education Support", "Other"]

const DISTRICTS = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha",
    "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala",
    "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa",
    "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
]

interface RequestHelpDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function RequestHelpDialog({ open, onOpenChange }: RequestHelpDialogProps) {
    const [showSuccess, setShowSuccess] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        location: "",
        needTypes: [] as string[],
        description: "",
    })
    const [errors, setErrors] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleNeedTypeToggle = (type: string) => {
        setFormData((prev) => ({
            ...prev,
            needTypes: prev.needTypes.includes(type) ? prev.needTypes.filter((t) => t !== type) : [...prev.needTypes, type],
        }))
    }

    const validateForm = () => {
        const newErrors: string[] = []
        if (!formData.name.trim()) newErrors.push("Name is required")
        if (!formData.phone.trim()) newErrors.push("Phone number is required")
        if (!formData.location.trim()) newErrors.push("Location is required")
        if (formData.needTypes.length === 0) newErrors.push("Select at least one need type")
        if (!formData.description.trim()) newErrors.push("Description is required")
        setErrors(newErrors)
        return newErrors.length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setIsSubmitting(true)
        try {
            const response = await apiClient.submitHelpRequest(formData)
            if (response.success) {
                setShowSuccess(true)
                setTimeout(() => {
                    setShowSuccess(false)
                    onOpenChange(false)
                    setFormData({
                        name: "",
                        phone: "",
                        location: "",
                        needTypes: [],
                        description: "",
                    })
                }, 3000)
            } else {
                setErrors([response.message || "Failed to submit request"])
            }
        } catch (error) {
            setErrors(["An error occurred. Please try again."])
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg w-full p-0 overflow-hidden">
                <div className="p-6 border-b bg-muted/10">
                    <DialogHeader>
                        <DialogTitle>Request Assistance</DialogTitle>
                        <DialogDescription>
                            Fill in your details to connect with verified donors.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    {showSuccess ? (
                        <div className="py-8 text-center animate-in fade-in zoom-in">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Request Sent!</h3>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
                                We will verify your request and publish it shortly.
                            </p>
                            <Button onClick={() => onOpenChange(false)} variant="outline">Close</Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {errors.length > 0 && (
                                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors[0]}</span>
                                </div>
                            )}

                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="name" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Your Name"
                                        className="mt-1"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="phone" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="077..."
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="location" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">District</Label>
                                        <Select
                                            value={DISTRICTS.includes(formData.location) ? formData.location : ""}
                                            onValueChange={(val) => setFormData({ ...formData, location: val })}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DISTRICTS.map(district => (
                                                    <SelectItem key={district} value={district}>{district}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Needs</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {NEED_TYPES.map((type) => {
                                            const isSelected = formData.needTypes.includes(type)
                                            return (
                                                <Badge
                                                    key={type}
                                                    variant={isSelected ? "default" : "outline"}
                                                    className={cn(
                                                        "cursor-pointer px-3 py-1 font-normal transition-all text-sm",
                                                        !isSelected && "bg-transparent hover:bg-secondary text-foreground"
                                                    )}
                                                    onClick={() => handleNeedTypeToggle(type)}
                                                >
                                                    {type}
                                                </Badge>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Situation</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Briefly describe what you need..."
                                        rows={3}
                                        className="mt-1 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
                                <Button onClick={handleSubmit} disabled={isSubmitting}>
                                    {isSubmitting ? "Sending..." : "Submit Request"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
