"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Check, Clock } from "lucide-react"

const NEED_TYPES = ["Food & Water", "Medical Supplies", "Shelter & Repairs", "Clothing", "Education Support", "Other"]

// Hardcoded admin setting - can be toggled
const MODERATION_ENABLED = true

type RequestHelpTabProps = {}

export function RequestHelpTab({}: RequestHelpTabProps) {
  const [showForm, setShowForm] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successStatus, setSuccessStatus] = useState<"approved" | "pending">("pending")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    needTypes: [] as string[],
    description: "",
  })
  const [errors, setErrors] = useState<string[]>([])

  const handleNeedTypeChange = (type: string) => {
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

    // Simulate form submission
    const status = MODERATION_ENABLED ? "pending" : "approved"
    setSuccessStatus(status)
    setShowForm(false)
    setShowSuccess(true)

    setTimeout(() => {
      setShowSuccess(false)
      setShowForm(true)
      setFormData({
        name: "",
        phone: "",
        location: "",
        needTypes: [],
        description: "",
      })
    }, 4000)
  }

  if (showSuccess) {
    return (
      <Card className="p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              successStatus === "approved" ? "bg-primary animate-bounce" : "bg-accent"
            }`}
          >
            {successStatus === "approved" ? (
              <Check className="w-8 h-8 text-primary-foreground animate-in fade-in zoom-in" />
            ) : (
              <Clock className="w-8 h-8 text-accent-foreground animate-pulse" />
            )}
          </div>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
          {successStatus === "approved" ? "Request Approved!" : "Request Submitted"}
        </h3>
        <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
          {successStatus === "approved"
            ? "Your request has been approved and will be reviewed by our relief team."
            : "Your request has been submitted and is pending review. We will contact you soon."}
        </p>
      </Card>
    )
  }

  if (!showForm) return null

  return (
    <div className="space-y-8">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-bold text-foreground mb-2">Request Assistance</h2>
        <p className="text-muted-foreground">
          If you or your community needs assistance, please fill out this form and our team will review your request.
        </p>
      </div>

      <Card className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {errors.length > 0 && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4 space-y-1 animate-in shake duration-300">
            {errors.map((error, i) => (
              <div key={i} className="flex gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            ))}
          </div>
        )}

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-foreground">Contact Information</h3>

          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: "100ms" }}>
            <Label htmlFor="name" className="text-foreground">
              Full Name *
            </Label>
            <Input
              id="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="text-foreground placeholder:text-muted-foreground transition-all focus:ring-2 focus:ring-primary"
            />
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: "150ms" }}
          >
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                Phone Number *
              </Label>
              <Input
                id="phone"
                placeholder="+94 777 123 456"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-foreground">
                Location (City/District) *
              </Label>
              <Input
                id="location"
                placeholder="e.g., Colombo, Galle"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* Type of Need */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: "200ms" }}>
          <h3 className="font-semibold text-lg text-foreground">Type of Need *</h3>
          <div className="grid grid-cols-2 gap-3">
            {NEED_TYPES.map((type, idx) => (
              <div
                key={type}
                className="flex items-center gap-2 transition-all"
                style={{ animationDelay: `${250 + idx * 25}ms` }}
              >
                <Checkbox
                  id={type}
                  checked={formData.needTypes.includes(type)}
                  onCheckedChange={() => handleNeedTypeChange(type)}
                  className="transition-all"
                />
                <Label htmlFor={type} className="text-foreground font-normal cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: "350ms" }}>
          <Label htmlFor="description" className="text-foreground">
            Detailed Description of Need *
          </Label>
          <Textarea
            id="description"
            placeholder="Please describe your situation and what assistance you need..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={5}
            className="text-foreground placeholder:text-muted-foreground resize-none"
          />
        </div>

        {/* Admin Toggle Info */}
        <div
          className={`p-4 rounded-lg transition-all ${
            MODERATION_ENABLED ? "bg-accent/10 border border-accent" : "bg-primary/10 border border-primary"
          } animate-in fade-in slide-in-from-bottom-2`}
          style={{ animationDelay: "400ms" }}
        >
          <p className="text-sm text-foreground">
            {MODERATION_ENABLED
              ? "⚠️ Your request will be reviewed by our team before being listed publicly."
              : "✓ Your request will be listed immediately and visible to relief coordinators."}
          </p>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:shadow-lg active:scale-95 animate-in fade-in slide-in-from-bottom-2"
          style={{ animationDelay: "450ms" }}
        >
          Submit Request
        </Button>
      </Card>
    </div>
  )
}
