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
          setTotal(data.data.total)
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
    <div className="bg-secondary/50 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 bg-card">
            <p className="text-muted-foreground text-sm mb-2">Total Donated</p>
            <p className="text-4xl font-bold text-primary">
              {displayTotal.toLocaleString()} <span className="text-lg text-foreground">LKR</span>
            </p>
          </Card>
          <Card className="p-6 bg-card">
            <p className="text-muted-foreground text-sm mb-2">Number of Donors</p>
            <p className="text-4xl font-bold text-accent">{donors.toLocaleString()}</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
