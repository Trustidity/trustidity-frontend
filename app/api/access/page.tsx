import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Key, Zap, Shield, Users, Globe } from "lucide-react"

export default function APIAccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Get API Access</h1>
            <p className="text-xl text-muted-foreground">
              Apply for API access to integrate Trustidity's verification services
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>API Access Application</CardTitle>
                  <CardDescription>
                    Tell us about your use case and we'll get you set up with API access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="john@company.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company/Organization *</Label>
                    <Input id="company" placeholder="Acme Corp" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Company Website</Label>
                    <Input id="website" type="url" placeholder="https://company.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="cto">CTO/Technical Lead</SelectItem>
                        <SelectItem value="product-manager">Product Manager</SelectItem>
                        <SelectItem value="founder">Founder/CEO</SelectItem>
                        <SelectItem value="hr">HR Manager</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="useCase">Use Case *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your primary use case" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recruitment">Employee Recruitment</SelectItem>
                        <SelectItem value="student-admission">Student Admissions</SelectItem>
                        <SelectItem value="loan-verification">Loan/Credit Verification</SelectItem>
                        <SelectItem value="visa-immigration">Visa/Immigration</SelectItem>
                        <SelectItem value="professional-licensing">Professional Licensing</SelectItem>
                        <SelectItem value="background-checks">Background Checks</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="volume">Expected Monthly Volume *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select expected volume" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-100">1-100 verifications</SelectItem>
                        <SelectItem value="101-500">101-500 verifications</SelectItem>
                        <SelectItem value="501-1000">501-1,000 verifications</SelectItem>
                        <SelectItem value="1001-5000">1,001-5,000 verifications</SelectItem>
                        <SelectItem value="5000+">5,000+ verifications</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Project Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your project and how you plan to use our API..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Credential Types Needed</Label>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="waec" />
                        <Label htmlFor="waec">WAEC</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="jamb" />
                        <Label htmlFor="jamb">JAMB</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="neco" />
                        <Label htmlFor="neco">NECO</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="university" />
                        <Label htmlFor="university">University Degrees</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="nmcn" />
                        <Label htmlFor="nmcn">NMCN</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="nysc" />
                        <Label htmlFor="nysc">NYSC</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="professional" />
                        <Label htmlFor="professional">Professional Certs</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="other-creds" />
                        <Label htmlFor="other-creds">Other</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <a href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Submit Application
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Plans
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Free Tier</h4>
                        <Badge variant="secondary">$0/month</Badge>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 100 verifications/month</li>
                        <li>• Basic support</li>
                        <li>• Standard SLA</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Pro</h4>
                        <Badge>$99/month</Badge>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 1,000 verifications/month</li>
                        <li>• Priority support</li>
                        <li>• Webhook integration</li>
                        <li>• 99.9% SLA</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Enterprise</h4>
                        <Badge variant="outline">Custom</Badge>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Unlimited verifications</li>
                        <li>• Dedicated support</li>
                        <li>• Custom integrations</li>
                        <li>• 99.99% SLA</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-1" />
                    <div>
                      <h5 className="font-semibold text-sm">Fast Processing</h5>
                      <p className="text-xs text-muted-foreground">Average response time under 30 seconds</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="h-4 w-4 text-primary mt-1" />
                    <div>
                      <h5 className="font-semibold text-sm">Global Coverage</h5>
                      <p className="text-xs text-muted-foreground">Nigerian and international institutions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-primary mt-1" />
                    <div>
                      <h5 className="font-semibold text-sm">Developer Support</h5>
                      <p className="text-xs text-muted-foreground">Technical assistance and documentation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Have questions about API integration or need a custom solution?
                  </p>
                  <Button variant="outline" className="w-full bg-transparent">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
