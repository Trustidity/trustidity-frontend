import { Shield, Zap, Globe, Users, CheckCircle, Clock } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: CheckCircle,
      title: "Restore Trust",
      description:
        "Advanced algorithms detect forged documents and prevent credential fraud, protecting genuine graduates and institutions.",
    },
    {
      icon: Zap,
      title: "End the Wait",
      description:
        "No more months of delays. Get instant verification results in seconds, not days. Real graduates deserve immediate recognition.",
    },
    {
      icon: Globe,
      title: "Global Recognition",
      description:
        "Trusted by institutions worldwide. Our verification certificates are accepted globally, opening doors for talent everywhere.",
    },
    {
      icon: Users,
      title: "Institutional Partnerships",
      description:
        "Direct partnerships with universities and certification bodies ensure authentic verification and protect institutional reputation.",
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description:
        "End-to-end encryption and secure storage protect sensitive credential data with the highest security standards.",
    },
    {
      icon: Clock,
      title: "Never Miss an Opportunity",
      description:
        "Eliminate career delays caused by slow verification processes. Opportunities wait for no one - neither should verification.",
    },
  ];

  return (
    <section id="features" className="py-20">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why Choose Trustidity?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Because every real graduate deserves to prove themselves without
            delay
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative rounded-2xl border bg-card p-8 shadow-sm"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-pretty">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
