"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Shield, Menu } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleSectionNavigation = (sectionId: string) => {
    setIsOpen(false); // Close mobile menu
    if (pathname === "/") {
      // If already on homepage, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If on another page, navigate to homepage with hash
      router.push(`/#${sectionId}`);
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false); // Close mobile menu when navigating
  };

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
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-4 mt-8">
              <button
                onClick={() => handleSectionNavigation("our-story")}
                className="text-left text-lg font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-2"
              >
                Our Story
              </button>
              <button
                onClick={() => handleSectionNavigation("how-it-works")}
                className="text-left text-lg font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-2"
              >
                How it Works
              </button>
              <button
                onClick={() => handleSectionNavigation("features")}
                className="text-left text-lg font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-2"
              >
                Features
              </button>
              <Link
                href="/pricing"
                onClick={handleLinkClick}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                onClick={handleLinkClick}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                About
              </Link>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-3 pt-6 border-t">
                <Link href="/login" onClick={handleLinkClick}>
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={handleLinkClick}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
