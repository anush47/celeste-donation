"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Check, MapPin, Phone, Calendar } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { format } from "date-fns"

const NEED_TYPES = ["Food & Water", "Medical Supplies", "Shelter & Repairs", "Clothing", "Education Support", "Other"]

// Sri Lankan Districts
const DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha",
  "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala",
  "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa",
  "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
]

interface HelpRequest {
  id: string
  name: string
  location: string
  needTypes: string[]
  description: string
  createdAt: string
  approved: boolean
}

export function RequestHelpTab() {
  const [requests, setRequests] = useState<HelpRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<HelpRequest[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Form State
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

  // Fetch Requests
  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await apiClient.getHelpRequests(true) // Fetch approved requests
        if (response.success && response.data) {
          setRequests(response.data)
          setFilteredRequests(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRequests()
  }, [])

  // Filter Requests
  useEffect(() => {
    if (selectedDistrict === "All") {
      setFilteredRequests(requests)
    } else {
      setFilteredRequests(requests.filter(req => req.location.toLowerCase().includes(selectedDistrict.toLowerCase())))
    }
  }, [selectedDistrict, requests])

  // Form Handlers
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

    setIsSubmitting(true)
    try {
      const response = await apiClient.submitHelpRequest(formData)
      if (response.success) {
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
          setIsDialogOpen(false)
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Community Needs</h2>
          <p className="text-muted-foreground">
            View current requests for assistance from affected communities.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
              Request Assistance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Request Assistance</DialogTitle>
              <DialogDescription>
                Fill out this form to request help. Our team will review your request shortly.
              </DialogDescription>
            </DialogHeader>

            {showSuccess ? (
              <div className="py-12 text-center animate-in fade-in zoom-in">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Check className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Request Submitted!</h3>
                <p className="text-muted-foreground">
                  Your request has been received and is pending review.
                </p>
              </div>
            ) : (
              <div className="space-y-6 mt-4">
                {errors.length > 0 && (
                  <div className="bg-destructive/10 border border-destructive rounded-lg p-4 space-y-1">
                    {errors.map((error, i) => (
                      <div key={i} className="flex gap-2 text-sm text-destructive">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+94 777..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">District *</Label>
                      <Select
                        value={DISTRICTS.includes(formData.location) ? formData.location : ""}
                        onValueChange={(val) => setFormData({ ...formData, location: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                          {DISTRICTS.map(district => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Type of Need *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {NEED_TYPES.map((type) => (
                        <div key={type} className="flex items-center gap-2">
                          <Checkbox
                            id={type}
                            checked={formData.needTypes.includes(type)}
                            onCheckedChange={() => handleNeedTypeChange(type)}
                          />
                          <Label htmlFor={type} className="font-normal cursor-pointer">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your situation..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="bg-accent/10 border border-accent p-3 rounded-md text-sm">
                  ⚠️ Your request will be reviewed by our team before being listed publicly.
                </div>

                <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-secondary/20 p-4 rounded-lg">
        <span className="font-medium text-sm">Filter by District:</span>
        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
          <SelectTrigger className="w-[200px] bg-background">
            <SelectValue placeholder="All Districts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Districts</SelectItem>
            {DISTRICTS.map(district => (
              <SelectItem key={district} value={district}>{district}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading requests...</div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <p className="text-muted-foreground">No requests found for the selected criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((req, idx) => (
            <Card
              key={req.id}
              className="p-6 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{req.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {req.location}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground flex items-center bg-secondary px-2 py-1 rounded">
                  <Calendar className="w-3 h-3 mr-1" />
                  {format(new Date(req.createdAt), "MMM d, yyyy")}
                </div>
              </div>

              <p className="text-foreground/90 mb-4 text-sm line-clamp-3">
                {req.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {req.needTypes.map(type => (
                  <span key={type} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                    {type}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t flex justify-between items-center">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="w-3 h-3 mr-1" />
                  {req.phone}
                </div>
                <Button variant="outline" size="sm">Offer Help</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
