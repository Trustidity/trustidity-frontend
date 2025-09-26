import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, FileCheck, Users, Building2, Globe } from "lucide-react";
import Link from "next/link";

const pricingPlans = [
  {
    name: "Individual Verification",
    description: "Perfect for students and job seekers",
    priceNGN: "₦2,500",
    priceUSD: "$5",
    period: "per verification",
    icon: FileCheck,
    features: [
      "Instant credential verification",
      "WAEC, JAMB, NECO certificates",
      "University degree verification",
      "Professional certificates (NMCN, etc.)",
      "Digital verification certificate",
      "24/7 online access",
      "Email support",
    ],
    cta: "Verify Now",
    popular: true,
    target: "individuals",
  },
  {
    name: "Employer Package",
    description: "For HR departments and recruiters",
    priceNGN: "₦15,000",
    priceUSD: "$30",
    period: "for 10 verifications",
    icon: Users,
    features: [
      "Bulk verification discounts",
      "Priority processing",
      "Detailed verification reports",
      "API access for integration",
      "Team dashboard access",
      "Phone & email support",
      "Custom verification templates",
      "90-day result storage",
    ],
    cta: "Get Started",
    popular: false,
    target: "employers",
  },
  {
    name: "Institution Partnership",
    description: "For schools and examination bodies",
    priceNGN: "Custom",
    priceUSD: "Custom",
    period: "pricing",
    icon: Building2,
    features: [
      "Direct integration with student records",
      "Automated verification responses",
      "White-label verification portal",
      "Unlimited verifications",
      "Dedicated account manager",
      "24/7 priority support",
      "Custom API development",
      "Revenue sharing model",
    ],
    cta: "Partner With Us",
    popular: false,
    target: "institutions",
  },
  {
    name: "Embassy/Government",
    description: "For diplomatic missions and agencies",
    priceNGN: "₦50,000",
    priceUSD: "$100",
    period: "monthly unlimited",
    icon: Globe,
    features: [
      "Unlimited verifications",
      "Diplomatic-grade security",
      "Multi-language support",
      "Batch processing tools",
      "Advanced fraud detection",
      "Dedicated support line",
      "Custom integration",
      "Compliance reporting",
    ],
    cta: "Contact Us",
    popular: false,
    target: "government",
  },
];

export function PricingSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Transparent Verification Pricing
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Affordable credential verification for everyone. Nigerian residents
            pay in Naira, international users in USD.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span>Nigeria: Naira pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span>International: USD pricing</span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 xl:grid-cols-4">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative p-2 sm:p-4 ${
                  plan.popular ? "border-primary shadow-lg scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <plan.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">
                          {plan.priceNGN}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          / {plan.priceUSD}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-3 w-3 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={
                      plan.target === "institutions"
                        ? "/partner"
                        : plan.target === "individuals"
                        ? "/verify"
                        : `/subscribe?plan=${plan.target}`
                    }
                    className="block"
                  >
                    <Button
                      className={`w-full text-sm ${
                        plan.popular ? "bg-primary text-primary-foreground" : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-foreground mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Which credentials can I verify?
              </h3>
              <p className="text-muted-foreground">
                We verify WAEC, JAMB, NECO certificates, university degrees from
                Nigerian institutions, NYSC certificates, professional
                certifications (NMCN, NBA, etc.), and other academic
                credentials.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                How long does verification take?
              </h3>
              <p className="text-muted-foreground">
                Most verifications are completed instantly for exam bodies like
                WAEC and JAMB. University degrees may take 24-48 hours depending
                on the institution's response time.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Why different prices for Nigeria vs International?
              </h3>
              <p className="text-muted-foreground">
                We offer affordable Naira pricing for Nigerian residents to
                ensure accessibility, while international pricing reflects the
                global market and additional processing requirements.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground">
                We accept bank transfers, debit cards, and mobile money for
                Nigerian users. International users can pay via credit cards,
                PayPal, and other global payment methods through Paystack.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Can institutions join as partners?
              </h3>
              <p className="text-muted-foreground">
                Yes! We partner with universities, polytechnics, and examination
                bodies to provide direct verification services. Contact us to
                discuss partnership opportunities and revenue sharing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
