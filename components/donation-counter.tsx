"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"

export function DonationCounter() {
  const [total, setTotal] = useState(0)
  const [donors, setDonors] = useState(0)
  const [displayTotal, setDisplayTotal] = useState(0)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await apiClient.getTotalDonations()
        if (data.success && data.data) {
          // Fix: API now returns detailed stats object
          setTotal(data.data.totalAmount || data.data.total || 0)
          setDonors(data.data.donors)
        }
      } catch (error) {
        console.error("Failed to fetch donation stats:", error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (displayTotal !== total) {
      const diff = total - displayTotal
      const steps = 20
      const increment = diff / steps
      let current = displayTotal

      const interval = setInterval(() => {
        current += increment
        setDisplayTotal(Math.floor(current))
        if (Math.abs(current - total) < Math.abs(increment)) {
          setDisplayTotal(total)
          clearInterval(interval)
        }
      }, 30)

      return () => clearInterval(interval)
    }
  }, [total, displayTotal])

  return (
    <div>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8">
          <Card className="p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 bg-card">
            <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1 md:mb-2">Total Donated</p>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary leading-tight">
              {displayTotal.toLocaleString()} <span className="text-xs sm:text-sm md:text-base lg:text-lg text-foreground">LKR</span>
            </p>
          </Card>
          <Card className="p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 bg-card">
            <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1 md:mb-2">Number of Donors</p>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-accent leading-tight">{donors.toLocaleString()}</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
