"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Building2, Users, Globe, Shield } from "lucide-react"
import Link from "next/link"

export function PartnerWithUs() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Partner with Trustidity</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our network of trusted institutions and help build a more secure credential verification ecosystem in
            Nigeria and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Educational Institutions</h3>
              <p className="text-sm text-muted-foreground">Universities, polytechnics, and colleges</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Employers</h3>
              <p className="text-sm text-muted-foreground">Companies and recruitment agencies</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Government Agencies</h3>
              <p className="text-sm text-muted-foreground">Embassies and regulatory bodies</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Professional Bodies</h3>
              <p className="text-sm text-muted-foreground">Certification and licensing organizations</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Partnership Application</CardTitle>
            <CardDescription>Tell us about your organization and how you'd like to partner with us</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input id="orgName" placeholder="Enter your organization name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgType">Organization Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="university">University</SelectItem>
                      <SelectItem value="polytechnic">Polytechnic</SelectItem>
                      <SelectItem value="college">College</SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                      <SelectItem value="government">Government Agency</SelectItem>
                      <SelectItem value="professional">Professional Body</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person</Label>
                  <Input id="contactName" placeholder="Full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email Address</Label>
                  <Input id="contactEmail" type="email" placeholder="contact@organization.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+234 xxx xxx xxxx" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" placeholder="https://www.organization.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Organization Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about your organization, its mission, and current credential verification processes"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnership">Partnership Interest</Label>
                <Textarea
                  id="partnership"
                  placeholder="How would you like to partner with Trustidity? What specific services or integrations are you interested in?"
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Partnership Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
