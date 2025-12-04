"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check } from "lucide-react"
import { Confetti } from "@/components/confetti"

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
}

// Sample packages with hardcoded data
const PACKAGES: Package[] = [
  {
    id: "pkg_1",
    name: "Family Food Kit",
    description: "Essential food items sufficient for a family of 4-5 for one month",
    imageUrl: "/food-relief-package.jpg",
    items: [
      { name: "Rice (5kg)", unitPrice: 1500, quantity: 1, imageUrl: "/bowl-of-steamed-rice.png" },
      { name: "Canned Food Pack", unitPrice: 600, quantity: 2, imageUrl: "/canned-food.jpg" },
      { name: "Cooking Oil (2L)", unitPrice: 1200, quantity: 1, imageUrl: "/cooking-oil.jpg" },
    ],
    total: 4900,
  },
  {
    id: "pkg_2",
    name: "Water & Hygiene Kit",
    description: "Clean water and essential hygiene products for emergency response",
    imageUrl: "/water-hygiene-kit.jpg",
    items: [
      { name: "Drinking Water (20L)", unitPrice: 2000, quantity: 2, imageUrl: "/clear-water-ripples.png" },
      { name: "Soap & Sanitizer Set", unitPrice: 800, quantity: 3, imageUrl: "/hygiene.jpg" },
      { name: "First Aid Kit", unitPrice: 1500, quantity: 1, imageUrl: "/first-aid.jpg" },
    ],
    total: 8300,
  },
  {
    id: "pkg_3",
    name: "Medical Supplies Kit",
    description: "Essential medical and health supplies for affected families",
    imageUrl: "/medical-supplies.jpg",
    items: [
      { name: "Medications & Antibiotics", unitPrice: 3000, quantity: 1, imageUrl: "/medicines.jpg" },
      { name: "Medical Equipment", unitPrice: 2500, quantity: 1, imageUrl: "/medical-team-collaboration.png" },
      { name: "Vitamin Supplements", unitPrice: 1000, quantity: 2, imageUrl: "/various-supplements.png" },
    ],
    total: 8500,
  },
]

interface PackageDonationTabProps {
  onDonate: (amount: number) => void
}

export function PackageDonationTab({ onDonate }: PackageDonationTabProps) {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg)
    setDetailsOpen(true)
    setCurrentImageIndex(0)
    setQuantity(1)
  }

  const handleDonate = () => {
    if (selectedPackage) {
      setShowConfetti(true)
      const totalAmount = selectedPackage.total * quantity
      onDonate(totalAmount)
      setShowSuccess(true)
      setDetailsOpen(false)

      setTimeout(() => {
        setShowSuccess(false)
        setShowConfetti(false)
        setSelectedPackage(null)
      }, 3000)
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
        {PACKAGES.map((pkg, idx) => (
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
                <h3 className="font-semibold text-lg text-foreground">{pkg.name}</h3>
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
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:shadow-lg active:scale-95"
                >
                  Donate This Package
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
