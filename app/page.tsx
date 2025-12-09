"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DonationCounter } from "@/components/donation-counter"
import { CashDonationTab } from "@/components/cash-donation-tab"
import { PackageDonationTab } from "@/components/package-donation-tab"
import { RequestHelpTab } from "@/components/request-help-tab"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Home() {
  const [donations, setDonations] = useState(2850000)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <Header />

      {/* Banner Section */}
      <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[65vh] min-h-[400px] sm:min-h-[450px] md:min-h-[500px] max-h-[600px] md:max-h-[700px] overflow-visible">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/disaster-relief-sri-lanka-charity-support-families-donation.jpg')",
            backgroundPosition: "center top",
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70" />
        {/* Content */}
        <div className="relative h-full flex items-center z-10">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6">
                Let's Rebuild Our Sri Lanka.
              </h2>
              <Button
                onClick={() => {
                  const element = document.getElementById("donate")
                  if (element) {
                    const headerHeight = 64
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                    const offsetPosition = elementPosition - headerHeight
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    })
                  }
                }}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base font-semibold px-6 sm:px-8 h-10 sm:h-12"
              >
                Donate Now
              </Button>
            </div>
          </div>
        </div>
        
        {/* Donation Counter - Overlapping */}
        <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-[30%] sm:translate-y-[35%] md:translate-y-1/2">
          <DonationCounter />
        </div>
      </section>

      {/* Main Content */}
      <main id="donate" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-8 sm:mt-10 md:mt-12 lg:mt-16">
        <Tabs defaultValue="cash" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
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

          <TabsContent value="help" id="help" className="space-y-6">
            <RequestHelpTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* How Your Donation Will Be Used Section */}
      <section id="how-used" className="bg-muted/30 py-12 sm:py-16 md:py-20 mt-16 sm:mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              How Your Donation Will Be Used
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
              100% of your contribution will go directly to coordinated emergency relief operations to support affected families.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Essential Food Supplies */}
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="font-semibold text-foreground text-sm sm:text-base mb-2">
                  Essential Food Supplies
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  for displaced families
                </p>
              </div>
            </Card>

            {/* Clean Water & Sanitation */}
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-200 dark:from-blue-900/20 dark:to-cyan-800/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="font-semibold text-foreground text-sm sm:text-base mb-2">
                  Clean Water & Sanitation
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  to prevent the spread of disease
                </p>
              </div>
            </Card>

            {/* Emergency Medical Aid */}
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <div className="aspect-video bg-gradient-to-br from-red-100 to-pink-200 dark:from-red-900/20 dark:to-pink-800/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="font-semibold text-foreground text-sm sm:text-base mb-2">
                  Emergency Medical Aid
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  for the injured and vulnerable
                </p>
              </div>
            </Card>

            {/* Temporary Shelter & Relief Kits */}
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/20 dark:to-emerald-800/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="font-semibold text-foreground text-sm sm:text-base mb-2">
                  Temporary Shelter & Relief Kits
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  for those who lost everything
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Your Support Matters Section */}
      <section id="why-support" className="pb-12 sm:pb-16 md:pb-20 pt-6 sm:pt-8 md:pt-10 mt-8 sm:mt-10 md:mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Your Support Matters
            </h2>
            <div className="space-y-4 max-w-4xl mx-auto">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                In times of crisis, solidarity and compassion are our greatest strengths. Your generosity can bring comfort, safety, and hope to those suffering – and empower communities to start rebuilding with dignity.
              </p>
              <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed">
                Let us come together as one nation – to heal, to rebuild, and to rise again.
              </p>
            </div>
          </div>
        </div>

        {/* Auto-scrolling Image Slider */}
        <div className="w-full overflow-hidden mt-8 sm:mt-12">
          <div className="flex animate-scroll">
            {/* First set of images */}
            <div className="flex gap-4 sm:gap-6 flex-shrink-0">
              <div className="w-[300px] sm:w-[400px] md:w-[500px] h-[200px] sm:h-[250px] md:h-[300px] flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop"
                  alt="Emergency relief efforts"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-[300px] sm:w-[400px] md:w-[500px] h-[200px] sm:h-[250px] md:h-[300px] flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop"
                  alt="Food relief distribution"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-[300px] sm:w-[400px] md:w-[500px] h-[200px] sm:h-[250px] md:h-[300px] flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=600&fit=crop"
                  alt="Community support"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-[300px] sm:w-[400px] md:w-[500px] h-[200px] sm:h-[250px] md:h-[300px] flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop"
                  alt="Disaster relief"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-[300px] sm:w-[400px] md:w-[500px] h-[200px] sm:h-[250px] md:h-[300px] flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop"
                  alt="Volunteer efforts"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex gap-4 sm:gap-6 flex-shrink-0">
              <div className="w-[300px] sm:w-[400px] md:w-[500px] h-[200px] sm:h-[250px] md:h-[300px] flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop"
                  alt="Emergency relief efforts"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-[300px] sm:w-[400px] md:w-[500px] h-[200px] sm:h-[250px] md:h-[300px] flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop"
                  alt="Food relief distribution"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-[300px] sm:w-[400px] md:w-[500px] h-[200px] sm:h-[250px] md:h-[300px] flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=600&fit=crop"
                  alt="Community support"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-[300px] sm:w-[400px] md:w-[500px] h-[200px] sm:h-[250px] md:h-[300px] flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop"
                  alt="Disaster relief"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-[300px] sm:w-[400px] md:w-[500px] h-[200px] sm:h-[250px] md:h-[300px] flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop"
                  alt="Volunteer efforts"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rebuild Sri Lanka Text */}
      <section className="bg-muted/30 py-8 sm:py-10 md:py-12 mt-8 sm:mt-10 md:mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Lets Rebuild Sri Lanka 🇱🇰
            </h2>
          </div>
        </div>
      </section>

      {/* Call to Action Section with Image */}
      <section className="relative w-full mt-16 sm:mt-20 overflow-hidden">
        <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px]">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/Footerimage.jpeg')",
            }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Content - Right Half */}
          <div className="relative h-full flex items-center justify-end">
            <div className="w-full md:w-1/2 h-full flex items-center justify-center md:justify-start px-4 sm:px-6 lg:px-8 md:pl-12 lg:pl-16">
              <div className="text-center md:text-left max-w-lg">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-lg">
                  Together, we can restore lives - one act of kindness at a time.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Colors Bar */}
      <div className="w-full flex">
        <div className="w-1/3 h-2 bg-black"></div>
        <div className="w-1/3 h-2 bg-white"></div>
        <div className="w-1/3 h-2 bg-red-600"></div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/80 dark:bg-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-muted-foreground text-sm text-center">
            Celeste × Red Cross Partnership • 100% of donations go directly to relief efforts
          </p>
        </div>
      </footer>
    </div>
  )
}
