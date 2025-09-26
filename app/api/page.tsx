import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Key, Zap, Shield, Globe, Clock } from "lucide-react"
import Link from "next/link"

export default function APIPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Trustidity API</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Integrate credential verification directly into your applications with our powerful REST API
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Fast & Reliable
                </CardTitle>
                <CardDescription>Get verification results in seconds with 99.9% uptime</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Secure by Design
                </CardTitle>
                <CardDescription>Enterprise-grade security with encrypted data transmission</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Global Coverage
                </CardTitle>
                <CardDescription>Verify credentials from institutions worldwide</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Real-time Updates
                </CardTitle>
                <CardDescription>Webhook support for instant verification status updates</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                API Endpoints
              </CardTitle>
              <CardDescription>RESTful API with comprehensive documentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">POST</Badge>
                  <code className="text-sm">/api/v1/verify</code>
                  <span className="text-sm text-muted-foreground">Submit verification request</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">GET</Badge>
                  <code className="text-sm">/api/v1/verify/{"{id}"}</code>
                  <span className="text-sm text-muted-foreground">Get verification status</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">GET</Badge>
                  <code className="text-sm">/api/v1/institutions</code>
                  <span className="text-sm text-muted-foreground">List supported institutions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">1. Get Your API Key</h4>
                <p className="text-sm text-muted-foreground">
                  Sign up for a Trustidity account and generate your API key from the dashboard
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">2. Make Your First Request</h4>
                <pre className="text-xs bg-background p-2 rounded mt-2 overflow-x-auto">
                  {`curl -X POST https://api.trustidity.com/v1/verify \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "certificate_number": "WAE123456789",
    "institution": "WAEC",
    "credential_type": "waec"
  }'`}
                </pre>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">3. Handle the Response</h4>
                <p className="text-sm text-muted-foreground">
                  Process verification results and integrate into your workflow
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/api/access">
              <Button size="lg" className="mr-4">
                Get API Access
              </Button>
            </Link>
            <Link href="/api/documentation">
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
