import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>

          <p className="text-muted-foreground mb-6">
            <strong>Last updated:</strong> January 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect information you provide directly to us, such as when you create an account, submit documents
              for verification, or contact us for support.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Personal information (name, email address, phone number)</li>
              <li>Credential information (certificate numbers, institution names)</li>
              <li>Payment information (processed securely through Paystack)</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide and maintain our verification services</li>
              <li>Process payments and transactions</li>
              <li>Communicate with you about our services</li>
              <li>Improve our platform and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties, except as
              described in this policy:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>With educational institutions for verification purposes</li>
              <li>With service providers who assist in our operations</li>
              <li>When required by law or to protect our rights</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. This includes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and assessments</li>
              <li>Access controls and authentication measures</li>
              <li>Secure payment processing through certified providers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access and update your personal information</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your data</li>
              <li>File a complaint with relevant authorities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-muted-foreground mt-4">
              Email: privacy@trustidity.com
              <br />
              Address: 123 Victoria Island, Lagos, Nigeria
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
