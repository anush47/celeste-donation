"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, MapPin, HeartHandshake, Filter } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { format } from "date-fns"
import { RequestHelpDialog } from "@/components/request-help-dialog"
import { RequestDetailsDialog } from "@/components/request-details-dialog"

// Sri Lankan Districts
const DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha",
  "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala",
  "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa",
  "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
]

export interface HelpRequest {
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
  const [isLoading, setIsLoading] = useState(true)

  // Dialog States
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null)

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

        <Button
          size="lg"
          onClick={() => setIsHelpDialogOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg font-semibold px-8 h-12 rounded-full transition-transform hover:scale-105"
        >
          Request Assistance
        </Button>
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-medium"
                    onClick={() => {
                      setSelectedRequest(req)
                      setIsDetailsDialogOpen(true)
                    }}
                  >
                    <HeartHandshake className="w-3 h-3 mr-2 text-primary" />
                    Offer Help
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <RequestHelpDialog
        open={isHelpDialogOpen}
        onOpenChange={setIsHelpDialogOpen}
      />

      <RequestDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        request={selectedRequest}
      />
    </div>
  )
}
