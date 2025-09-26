import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>

          <p className="text-muted-foreground mb-6">
            <strong>Last updated:</strong> January 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using Trustidity's services, you accept and agree to be bound by the terms and provision
              of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              Trustidity provides credential verification services that allow users to verify academic and professional
              credentials from various institutions. Our services include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Document verification for individuals</li>
              <li>Bulk verification services for employers</li>
              <li>API access for integration partners</li>
              <li>Institutional partnerships</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
            <p className="text-muted-foreground mb-4">Users are responsible for:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Providing accurate and truthful information</li>
              <li>Maintaining the confidentiality of account credentials</li>
              <li>Using the service only for lawful purposes</li>
              <li>Respecting intellectual property rights</li>
              <li>Complying with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Payment Terms</h2>
            <p className="text-muted-foreground mb-4">Payment terms for our services:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Payments are processed securely through Paystack</li>
              <li>Fees are charged per verification or subscription plan</li>
              <li>Refunds are available within 30 days for unused services</li>
              <li>Prices may change with 30 days notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              Trustidity shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Termination</h2>
            <p className="text-muted-foreground mb-4">
              We may terminate or suspend your account and bar access to the service immediately, without prior notice
              or liability, under our sole discretion, for any reason whatsoever and without limitation, including but
              not limited to a breach of the Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
              provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contact Information</h2>
            <p className="text-muted-foreground">If you have any questions about these Terms, please contact us at:</p>
            <p className="text-muted-foreground mt-4">
              Email: legal@trustidity.com
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
