import { Shield, Globe, Users, Zap } from "lucide-react"

const values = [
  {
    icon: Shield,
    title: "Security First",
    description:
      "We employ bank-level security measures to protect sensitive credential data and ensure the highest standards of privacy and compliance.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Our platform connects institutions worldwide, creating a unified network for credential verification across borders and cultures.",
  },
  {
    icon: Users,
    title: "Trust & Transparency",
    description:
      "We believe in building trust through transparency, providing clear verification processes and maintaining the highest ethical standards.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "We continuously innovate to stay ahead of fraud techniques and provide the most advanced verification technology available.",
  },
]

export function MissionSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our Mission & Values</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We're committed to creating a world where credentials can be trusted instantly and universally.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl border bg-card p-8 shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
                </div>
                <p className="text-muted-foreground text-pretty">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-3xl mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-6">The Problem We Solve</h3>
          <p className="text-lg text-muted-foreground text-pretty">
            Credential fraud costs organizations billions of dollars annually and undermines trust in legitimate
            achievements. Traditional verification methods are slow, expensive, and often unreliable. Trustidity solves
            this by providing instant, secure, and globally recognized credential verification that protects both
            individuals and organizations from fraud while streamlining the verification process.
          </p>
        </div>
      </div>
    </section>
  )
}
