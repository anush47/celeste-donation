"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DonationCounter } from "@/components/donation-counter"
import { CashDonationTab } from "@/components/cash-donation-tab"
import { PackageDonationTab } from "@/components/package-donation-tab"
import { RequestHelpTab } from "@/components/request-help-tab"
import { Heart } from "lucide-react"

export default function Home() {
  const [donations, setDonations] = useState(2850000)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Celeste × Red Cross</h1>
              <p className="text-muted-foreground">Sri Lanka Flood Relief</p>
            </div>
          </div>
          <p className="text-foreground text-pretty leading-relaxed">
            Together, we're providing emergency relief and support to communities affected by flooding in Sri Lanka.
            Your contribution makes a real difference.
          </p>
        </div>
      </header>

      {/* Donation Counter */}
      <DonationCounter total={donations} donors={1240} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="cash" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="cash">Cash Donation</TabsTrigger>
            <TabsTrigger value="packages">Donate a Package</TabsTrigger>
            <TabsTrigger value="help">Request Help</TabsTrigger>
          </TabsList>

          <TabsContent value="cash" className="space-y-6">
            <CashDonationTab onDonate={(amount) => setDonations(donations + amount)} />
          </TabsContent>

          <TabsContent value="packages" className="space-y-6">
            <PackageDonationTab onDonate={(amount) => setDonations(donations + amount)} />
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <RequestHelpTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-muted-foreground text-sm text-center">
            Celeste × Red Cross Partnership • 100% of donations go directly to relief efforts
          </p>
        </div>
      </footer>
    </div>
  )
}
