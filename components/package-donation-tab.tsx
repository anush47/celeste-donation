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
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Relief Packages</h2>
        <p className="text-muted-foreground mb-8 text-sm sm:text-base">
          Choose a curated relief package to donate. Each package is designed to meet specific community needs.
        </p>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {packages.map((pkg, idx) => (
          <Card
            key={pkg.id}
            className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] group animate-in fade-in slide-in-from-bottom-4"
            style={{
              animationDelay: `${idx * 100}ms`,
            }}
          >
            <div className="relative overflow-hidden">
              <img 
                src={pkg.imageUrl || "/placeholder.svg"} 
                alt={pkg.name} 
                className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-110" 
              />
              {pkg.donationCount !== undefined && pkg.donationCount > 0 && (
                <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                  {pkg.donationCount} donated
                </div>
              )}
            </div>
            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="font-bold text-lg sm:text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                  {pkg.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {pkg.description}
                </p>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4 rounded-xl">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 font-medium">Package Total</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary">
                  {pkg.total.toLocaleString()} <span className="text-base text-foreground">LKR</span>
                </p>
              </div>

              <Button
                onClick={() => handleSelectPackage(pkg)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:shadow-xl hover:scale-[1.02] active:scale-98 font-semibold py-6 rounded-xl text-base"
              >
                View & Donate →
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
              <DialogTitle className="text-2xl sm:text-3xl font-bold">{selectedPackage.name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
              {/* Image Carousel */}
              <div className="relative bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={selectedPackage.imageUrl || "/placeholder.svg"}
                  alt={selectedPackage.name}
                  className="w-full h-64 sm:h-80 object-cover"
                />
              </div>

              {/* Package Items */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg sm:text-xl text-foreground">Package Contents</h3>
                <div className="space-y-3">
                  {selectedPackage.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 border-2 border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all bg-card animate-in fade-in slide-in-from-left-4"
                      style={{
                        animationDelay: `${100 + idx * 50}ms`,
                      }}
                    >
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm sm:text-base">{item.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {item.quantity}x @ {item.unitPrice.toLocaleString()} LKR
                        </p>
                      </div>
                      <p className="font-bold text-primary text-base sm:text-lg">
                        {(item.unitPrice * item.quantity).toLocaleString()} LKR
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-300">
                <label className="text-sm sm:text-base font-semibold text-foreground">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-border hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all active:scale-90 font-bold text-base shadow-sm hover:shadow-md"
                  >
                    −
                  </button>
                  <span className="text-xl sm:text-2xl font-bold text-foreground w-10 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border-2 border-border hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all active:scale-90 font-bold text-base shadow-sm hover:shadow-md"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Donor Details */}
              <div className="space-y-4 border-t border-border pt-6">
                <h3 className="font-bold text-lg sm:text-xl text-foreground">Your Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-medium">Name *</Label>
                    <Input 
                      id="name" 
                      value={donorInfo.name} 
                      onChange={e => setDonorInfo({ ...donorInfo, name: e.target.value })} 
                      placeholder="Your Name"
                      className="text-base py-6 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-medium">Phone *</Label>
                    <Input 
                      id="phone" 
                      value={donorInfo.phone} 
                      onChange={e => setDonorInfo({ ...donorInfo, phone: e.target.value })} 
                      placeholder="+94 777 123 456"
                      className="text-base py-6 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="font-medium">Email (Optional)</Label>
                    <Input 
                      id="email" 
                      value={donorInfo.email} 
                      onChange={e => setDonorInfo({ ...donorInfo, email: e.target.value })} 
                      placeholder="your.email@example.com"
                      className="text-base py-6 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 p-5 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-semibold text-base sm:text-lg">Total Amount</span>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">
                    {(selectedPackage.total * quantity).toLocaleString()} <span className="text-lg text-foreground">LKR</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={() => setDetailsOpen(false)} 
                  variant="outline" 
                  className="flex-1 py-6 rounded-xl font-semibold text-base border-2 hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDonate}
                  disabled={isProcessing}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:shadow-xl hover:scale-[1.02] active:scale-98 py-6 rounded-xl font-semibold text-base"
                >
                  {isProcessing ? "Processing..." : "Complete Donation"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
