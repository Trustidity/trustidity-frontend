import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, CheckCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-10 overflow-hidden">
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex items-center space-x-2 rounded-full bg-muted px-4 py-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-muted-foreground">Trusted by 500+ institutions worldwide</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
            Trustidity – Verify Academic & Professional <span className="text-primary">Credentials Instantly</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground text-pretty">
            Secure, fast, and reliable credential verification platform for individuals, employers, and institutions.
            Eliminate fraud and build trust with instant verification.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/verify">
              <Button size="lg" className="w-full sm:w-auto">
                Verify a Document
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/partner">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Partner with Us
              </Button>
            </Link>
          </div>

          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-green-500/20 blur-3xl" />
            <div className="relative rounded-2xl border bg-card p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground">Bank-Level Security</h3>
                  <p className="text-sm text-muted-foreground mt-2">End-to-end encryption and secure storage</p>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">⚡</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Instant Results</h3>
                  <p className="text-sm text-muted-foreground mt-2">Get verification results in seconds</p>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">🌍</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Global Network</h3>
                  <p className="text-sm text-muted-foreground mt-2">Connected to institutions worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
