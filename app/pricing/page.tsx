import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PricingSection } from "@/components/pricing-section"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}
