"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check } from "lucide-react"
import { Confetti } from "@/components/confetti"
import { apiClient } from "@/lib/api-client"
import { DonationType } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PackageItem {
  name: string
  unitPrice: number
  quantity: number
  imageUrl: string
}

interface Package {
  id: string
  name: string
  description: string
  imageUrl: string
  items: PackageItem[]
  total: number
  donationCount?: number
}

interface PackageDonationTabProps {
  onDonate: (amount: number) => void
}

export function PackageDonationTab({ onDonate }: PackageDonationTabProps) {
  const [packages, setPackages] = useState<Package[]>([])
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [donorInfo, setDonorInfo] = useState({ name: "", phone: "", email: "" })
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    async function fetchPackages() {
      try {
        const response = await apiClient.getPackages()
        if (response.success && response.data) {
          setPackages(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch packages:", error)
      }
    }
    fetchPackages()
  }, [])

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg)
    setDetailsOpen(true)
    setQuantity(1)
  }

  const handleDonate = async () => {
    if (!selectedPackage) return
    if (!donorInfo.name || !donorInfo.phone) {
      alert("Please fill in required fields")
      return
    }

    setIsProcessing(true)
    try {
      const totalAmount = selectedPackage.total * quantity
      const response = await apiClient.createPayment({
        amount: totalAmount,
        donorName: donorInfo.name,
        donorPhone: donorInfo.phone,
        donorEmail: donorInfo.email,
        type: "PACKAGE" as DonationType,
        packageId: selectedPackage.id,
      })

      if (response.success) {
        setShowConfetti(true)
        onDonate(totalAmount)
        setShowSuccess(true)
        setDetailsOpen(false)

        // Refresh packages to update count
        try {
          const pkgResponse = await apiClient.getPackages()
          if (pkgResponse.success && pkgResponse.data) {
            setPackages(pkgResponse.data)
          }
        } catch (e) {
          console.error("Failed to refresh packages", e)
        }

        setTimeout(() => {
          setShowSuccess(false)
          setShowConfetti(false)
          setSelectedPackage(null)
          setDonorInfo({ name: "", phone: "", email: "" })
        }, 3000)
      } else {
        alert(response.message || "Donation failed")
      }
    } catch (error) {
      console.error("Error processing donation:", error)
      alert("An error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  if (showSuccess) {
    return (
      <>
        {showConfetti && <Confetti />}
        <Card className="p-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center animate-bounce">
              <Check className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
            Package Donated!
          </h3>
          <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
            Your donation will reach those in need very soon. Thank you for your generosity.
          </p>
        </Card>
      </>
    )
  }

  return (
    <div className="space-y-8">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-bold text-foreground mb-6">Relief Packages</h2>
        <p className="text-muted-foreground mb-8">
          Choose a curated relief package to donate. Each package is designed to meet specific community needs.
        </p>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg, idx) => (
          <Card
            key={pkg.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
            style={{
              animationDelay: `${idx * 100}ms`,
            }}
          >
            <img src={pkg.imageUrl || "/placeholder.svg"} alt={pkg.name} className="w-full h-48 object-cover" />
            <div className="p-6 space-y-4">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-foreground">{pkg.name}</h3>
                  {pkg.donationCount !== undefined && pkg.donationCount > 0 && (
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                      {pkg.donationCount} donated
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{pkg.description}</p>
              </div>

              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Package Total</p>
                <p className="text-2xl font-bold text-primary">{pkg.total.toLocaleString()} LKR</p>
              </div>

              <Button
                onClick={() => handleSelectPackage(pkg)}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all hover:shadow-lg active:scale-95"
              >
                View & Donate
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Package Details Modal */}
      {selectedPackage && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedPackage.name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
              {/* Image Carousel */}
              <div className="relative bg-muted rounded-lg overflow-hidden">
                <img
                  src={selectedPackage.imageUrl || "/placeholder.svg"}
                  alt={selectedPackage.name}
                  className="w-full h-80 object-cover"
                />
              </div>

              {/* Package Items */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-foreground">Package Contents</h3>
                <div className="space-y-3">
                  {selectedPackage.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 border border-border rounded-lg animate-in fade-in slide-in-from-left-4 transition-all"
                      style={{
                        animationDelay: `${100 + idx * 50}ms`,
                      }}
                    >
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity}x @ {item.unitPrice.toLocaleString()} LKR
                        </p>
                      </div>
                      <p className="font-semibold text-foreground">
                        {(item.unitPrice * item.quantity).toLocaleString()} LKR
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-300">
                <label className="text-sm font-medium text-foreground">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded border border-border hover:bg-muted transition-all active:scale-90"
                  >
                    −
                  </button>
                  <span className="text-xl font-semibold text-foreground w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded border border-border hover:bg-muted transition-all active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Donor Details */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold">Your Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" value={donorInfo.name} onChange={e => setDonorInfo({ ...donorInfo, name: e.target.value })} placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" value={donorInfo.phone} onChange={e => setDonorInfo({ ...donorInfo, phone: e.target.value })} placeholder="Your Phone" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={donorInfo.email} onChange={e => setDonorInfo({ ...donorInfo, email: e.target.value })} placeholder="Your Email" />
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-medium">Total Amount</span>
                  <p className="text-2xl font-bold text-primary">
                    {(selectedPackage.total * quantity).toLocaleString()} LKR
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={() => setDetailsOpen(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleDonate}
                  disabled={isProcessing}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:shadow-lg active:scale-95"
                >
                  {isProcessing ? "Processing..." : "Donate This Package"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
