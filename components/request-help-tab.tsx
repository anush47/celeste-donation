"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Check, MapPin, Phone, Calendar, HeartHandshake, User, Map, FileText, Filter } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

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
  phone: string
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
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Community Needs Board</h2>
          <p className="text-muted-foreground max-w-xl">
            This board connects generous donors with people in immediate need. Browse the requests below or submit your own if you require assistance.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg font-semibold px-8 h-12 rounded-full transition-transform hover:scale-105">
              Request Assistance
            </Button>
          </DialogTrigger>
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
                  <Button onClick={() => setIsDialogOpen(false)} variant="outline">Close</Button>
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
                    <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Submit Request"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Latest Requests
            <Badge variant="secondary" className="rounded-full">{filteredRequests.length}</Badge>
          </h3>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-[180px]">
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
        </div>

        {/* Requests Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-16 bg-muted/20 rounded-2xl border-2 border-dashed">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No requests found</h3>
            <p className="text-muted-foreground">Try changing the district filter or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((req, idx) => (
              <Card
                key={req.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 border-muted flex flex-col group"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        {req.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground line-clamp-1">{req.name}</h3>
                        <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                          <MapPin className="w-3 h-3 mr-1" />
                          {req.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-1 rounded">
                      {format(new Date(req.createdAt), "MMM d")}
                    </div>
                  </div>

                  <p className="text-sm text-foreground/80 mb-4 line-clamp-3 leading-relaxed">
                    {req.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {req.needTypes.map(type => (
                      <Badge key={type} variant="secondary" className="px-2 py-0.5 text-[10px] font-normal">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-muted/30 border-t flex justify-between items-center group-hover:bg-muted/50 transition-colors">
                  <div className="text-xs font-medium text-muted-foreground flex items-center">
                    Verified Request
                    <Check className="w-3 h-3 ml-1 text-green-500" />
                  </div>
                  <Button variant="outline" size="sm" asChild className="h-8 text-xs font-medium">
                    <a href={`tel:${req.phone}`}>
                      <HeartHandshake className="w-3 h-3 mr-2 text-primary" />
                      Offer Help
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
