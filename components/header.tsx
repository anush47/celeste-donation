"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerHeight = 64 // h-16 = 4rem = 64px
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80",
        className
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section - Left */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => scrollToSection("home")}
          >
            <div className="flex items-center gap-1.5">
              {/* Celeste Logo */}
              <div className="w-8 h-8 flex items-center justify-center">
                <img
                  src="/Celeste Logo Icon (1).png"
                  alt="Celeste Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Red Cross Emblem in White Circle */}
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-0.5 shadow-sm border border-border/50">
                <img
                  src="/Emblem_10.jpg"
                  alt="Red Cross Emblem"
                  className="w-full h-full object-cover rounded-full scale-110"
                />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">
                සුවසහන යාත්‍රා
              </h1>
              <p className="text-xs text-muted-foreground leading-tight">
                Sri Lanka Flood Relief
              </p>
            </div>
          </div>

          {/* Menu Items - Center */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("donate")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Donate
            </button>
            <button
              onClick={() => scrollToSection("how-used")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              How It's Used
            </button>
            <button
              onClick={() => scrollToSection("why-support")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Why Support
            </button>
            {/* <button
              onClick={() => scrollToSection("help")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Request Help
            </button> */}
          </nav>

          {/* Donation Button - Right */}
          <Button
            onClick={() => scrollToSection("donate")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Donate Now
          </Button>
        </div>
      </div>
    </header>
  )
}

