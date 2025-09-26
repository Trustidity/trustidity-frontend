import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-Founder",
    bio: "Former VP of Security at a major financial institution with 15 years of experience in fraud prevention and digital identity.",
    initials: "SC",
  },
  {
    name: "Michael Rodriguez",
    role: "CTO & Co-Founder",
    bio: "Ex-Google engineer specializing in distributed systems and cryptography. PhD in Computer Science from MIT.",
    initials: "MR",
  },
  {
    name: "Dr. Emily Watson",
    role: "Head of Partnerships",
    bio: "Former Dean of Admissions with extensive experience in academic credential evaluation and institutional partnerships.",
    initials: "EW",
  },
  {
    name: "David Kim",
    role: "Head of Product",
    bio: "Product leader with 10+ years building enterprise SaaS platforms. Previously at Salesforce and Stripe.",
    initials: "DK",
  },
]

export function TeamSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Meet Our Team</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Experienced leaders from technology, finance, and education working together to eliminate credential fraud.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {team.map((member) => (
              <Card key={member.name} className="border bg-card shadow-sm">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
                      <p className="text-primary font-medium">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-pretty">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-3xl mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-6">Join Our Mission</h3>
          <p className="text-lg text-muted-foreground text-pretty">
            We're always looking for talented individuals who share our passion for building trust and preventing fraud.
            If you're interested in joining our team, we'd love to hear from you.
          </p>
        </div>
      </div>
    </section>
  )
}
