import { FileText, Search, CheckCircle } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: FileText,
      title: "Provide Details",
      description:
        "Enter your credential information including certificate number, name, and institution details.",
    },
    {
      icon: Search,
      title: "Verify",
      description:
        "Our system instantly checks the credential against institutional databases and official records.",
    },
    {
      icon: CheckCircle,
      title: "Trusted",
      description:
        "Receive a verified certificate that employers and institutions can trust and rely on.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simple, secure, and fast credential verification in three easy steps
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground text-pretty">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-1/2 hidden w-full md:block">
                    <div className="h-0.5 w-full bg-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
