"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check } from "lucide-react"
import { Confetti } from "@/components/confetti"
import { apiClient } from "@/lib/api-client"
import { DonationType } from "@prisma/client"

const PREDEFINED_AMOUNTS = [500, 1000, 5000, 10000, 15000]

interface CashDonationTabProps {
  onDonate: (amount: number) => void
}

export function CashDonationTab({ onDonate }: CashDonationTabProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [donorInfo, setDonorInfo] = useState({ name: "", phone: "", email: "" })
  const [errors, setErrors] = useState<string[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const amount = selectedAmount || (customAmount ? Number.parseInt(customAmount) : 0)

  const handleCustomAmount = (value: string) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue)) {
      setCustomAmount(value)
      setSelectedAmount(null)
    } else if (value === "") {
      setCustomAmount("")
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []
    if (!donorInfo.name.trim()) newErrors.push("Name is required")
    if (!donorInfo.phone.trim()) newErrors.push("Phone number is required")
    if (!selectedAmount && amount < 500) newErrors.push("Minimum donation is 500 LKR")
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleDonate = async () => {
    if (!validateForm()) return

    setIsProcessing(true)
    try {
      const response = await apiClient.createPayment({
        amount,
        donorName: donorInfo.name,
        donorPhone: donorInfo.phone,
        donorEmail: donorInfo.email,
        type: "CASH" as DonationType,
      })

      if (response.success) {
        setShowConfetti(true)
        setShowForm(false)
        setShowSuccess(true)
        onDonate(amount)

        setTimeout(() => {
          setShowSuccess(false)
          setShowConfetti(false)
          setSelectedAmount(null)
          setCustomAmount("")
          setDonorInfo({ name: "", phone: "", email: "" })
        }, 3000)
      } else {
        setErrors([response.message || "Donation failed"])
      }
    } catch (error) {
      console.error("Error processing donation:", error)
      setErrors(["An error occurred. Please try again."])
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
            Thank You!
          </h3>
          <p className="text-muted-foreground mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
            Your donation of <span className="font-semibold text-primary">{amount.toLocaleString()} LKR</span> has been
            received.
          </p>
          <p className="text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
            Together, we're making a difference for communities in need.
          </p>
        </Card>
      </>
    )
  }

  return (
    <div className="space-y-8">
      {/* Amount Selection */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Select Donation Amount</h2>
        <p className="text-muted-foreground mb-6 text-sm sm:text-base">Choose a preset amount or enter your own</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {PREDEFINED_AMOUNTS.map((amt, idx) => (
            <button
              key={amt}
              onClick={() => {
                setSelectedAmount(amt)
                setCustomAmount("")
              }}
              className={`group relative p-4 sm:p-5 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 ${
                selectedAmount === amt
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50 scale-105 ring-2 ring-primary ring-offset-2"
                  : "bg-gradient-to-br from-card to-muted text-foreground hover:from-primary/10 hover:to-primary/5 border-2 border-border hover:border-primary/50 shadow-md hover:shadow-lg"
              }`}
              style={{
                animationDelay: `${idx * 50}ms`,
              }}
            >
              <span className="relative z-10">
                {amt.toLocaleString()}
                <span className="text-xs sm:text-sm font-normal ml-1 opacity-80">LKR</span>
              </span>
              {selectedAmount === amt && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-primary-foreground rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom" className="text-foreground font-medium">
            Or enter a custom amount (min. 500 LKR)
          </Label>
          <div className="relative">
            <Input
              id="custom"
              type="number"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={(e) => handleCustomAmount(e.target.value)}
              min={500}
              className="text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary text-lg py-6 pl-4 pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">LKR</span>
          </div>
        </div>
      </div>

      {/* Donation Button */}
      {!showForm && amount > 0 && (
        <Button
          onClick={() => setShowForm(true)}
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-98 text-base sm:text-lg font-semibold py-6 rounded-xl shadow-lg"
        >
          Continue with {amount.toLocaleString()} LKR Donation →
        </Button>
      )}

      {/* Donor Information Form */}
      {showForm && (
        <Card className="p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-xl font-semibold text-foreground">Donation Details</h3>

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

          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Full Name *
            </Label>
            <Input
              id="name"
              placeholder="Your name"
              value={donorInfo.name}
              onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
              className="text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">
              Phone Number *
            </Label>
            <Input
              id="phone"
              placeholder="+94 777 123 456"
              value={donorInfo.phone}
              onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
              className="text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email (Optional)
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={donorInfo.email}
              onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
              className="text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-foreground">
              Amount to donate: <span className="font-bold text-primary">{amount.toLocaleString()} LKR</span>
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
              Back
            </Button>
            <Button
              onClick={handleDonate}
              disabled={isProcessing}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:shadow-lg active:scale-95"
            >
              {isProcessing ? "Processing..." : "Complete Donation"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
