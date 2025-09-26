import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Briefcase } from "lucide-react"

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Lagos, Nigeria",
      type: "Full-time",
      description: "Join our engineering team to build the next generation of credential verification technology.",
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      description: "Lead product strategy and development for our verification platform.",
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Lagos, Nigeria",
      type: "Full-time",
      description: "Help our clients maximize value from Trustidity's verification services.",
    },
    {
      title: "Security Engineer",
      department: "Security",
      location: "Remote",
      type: "Full-time",
      description: "Ensure the highest security standards for our credential verification platform.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Join Our Team</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Help us build the future of credential verification. We're looking for passionate individuals to join our
              mission.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Great Team
                </CardTitle>
                <CardDescription>Work with talented individuals from diverse backgrounds</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Growth Opportunities
                </CardTitle>
                <CardDescription>Advance your career in a fast-growing company</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Work-Life Balance
                </CardTitle>
                <CardDescription>Flexible working arrangements and comprehensive benefits</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Open Positions</h2>
            <div className="space-y-4">
              {openPositions.map((position, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{position.title}</CardTitle>
                        <CardDescription className="mt-2">{position.description}</CardDescription>
                      </div>
                      <Button>Apply Now</Button>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Badge variant="secondary">{position.department}</Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {position.location}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {position.type}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Don't see a perfect fit?</CardTitle>
              <CardDescription>
                We're always looking for talented individuals. Send us your resume and tell us how you'd like to
                contribute.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Send General Application</Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
