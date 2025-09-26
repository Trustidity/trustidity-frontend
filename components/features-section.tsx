import { Shield, Zap, Globe, Users } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Fraud Prevention",
      description: "Advanced algorithms detect forged documents and prevent credential fraud with 99.9% accuracy.",
    },
    {
      icon: Zap,
      title: "Fast Verification",
      description:
        "Get instant verification results in seconds, not days. Streamline your hiring and admission processes.",
    },
    {
      icon: Globe,
      title: "Global Trust",
      description: "Recognized by institutions worldwide. Our verification certificates are accepted globally.",
    },
    {
      icon: Users,
      title: "Institutional Partnerships",
      description: "Direct partnerships with universities and certification bodies ensure authentic verification.",
    },
  ]

  return (
    <section id="features" className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why Choose Trustidity?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The most trusted credential verification platform in the world
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="relative rounded-2xl border bg-card p-8 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                </div>
                <p className="mt-4 text-muted-foreground text-pretty">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
