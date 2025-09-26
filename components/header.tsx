"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Shield, Menu, User } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleSectionNavigation = (sectionId: string) => {
    setIsOpen(false) // Close mobile menu
    if (pathname === "/") {
      // If already on homepage, scroll to section
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      // If on another page, navigate to homepage with hash
      router.push(`/#${sectionId}`)
    }
  }

  const handleLinkClick = () => {
    setIsOpen(false) // Close mobile menu when navigating
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">Trustidity</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => handleSectionNavigation("our-story")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Our Story
          </button>
          <button
            onClick={() => handleSectionNavigation("how-it-works")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            How it Works
          </button>
          <button
            onClick={() => handleSectionNavigation("features")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Features
          </button>
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-2 md:hidden">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="px-2">
              <User className="h-4 w-4" />
              <span className="sr-only">Sign In</span>
            </Button>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px] p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="font-bold text-foreground">Trustidity</span>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-6 py-4">
                  <div className="space-y-1">
                    <button
                      onClick={() => handleSectionNavigation("our-story")}
                      className="flex items-center w-full px-3 py-3 text-left text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors cursor-pointer"
                    >
                      Our Story
                    </button>
                    <button
                      onClick={() => handleSectionNavigation("how-it-works")}
                      className="flex items-center w-full px-3 py-3 text-left text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors cursor-pointer"
                    >
                      How it Works
                    </button>
                    <button
                      onClick={() => handleSectionNavigation("features")}
                      className="flex items-center w-full px-3 py-3 text-left text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors cursor-pointer"
                    >
                      Features
                    </button>
                    <Link
                      href="/pricing"
                      onClick={handleLinkClick}
                      className="flex items-center w-full px-3 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                      Pricing
                    </Link>
                    <Link
                      href="/about"
                      onClick={handleLinkClick}
                      className="flex items-center w-full px-3 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                      About
                    </Link>
                  </div>
                </nav>

                {/* Auth Buttons */}
                <div className="p-6 border-t bg-muted/30">
                  <div className="space-y-3">
                    <Link href="/login" onClick={handleLinkClick}>
                      <Button variant="outline" className="w-full justify-center bg-transparent">
                        <User className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={handleLinkClick}>
                      <Button className="w-full justify-center">Get Started</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
