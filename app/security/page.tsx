import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Server, Key, FileCheck } from "lucide-react";

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: <Lock className="h-6 w-6" />,
      title: "End-to-End Encryption",
      description:
        "All data is encrypted in transit and at rest using industry-standard AES-256 encryption.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Multi-Factor Authentication",
      description:
        "Secure your account with SMS, email, or authenticator app-based 2FA.",
    },
    {
      icon: <Server className="h-6 w-6" />,
      title: "Secure Infrastructure",
      description:
        "Hosted on enterprise-grade cloud infrastructure with 99.9% uptime guarantee.",
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Regular Security Audits",
      description:
        "Third-party security assessments and penetration testing conducted quarterly.",
    },
    {
      icon: <Key className="h-6 w-6" />,
      title: "API Security",
      description:
        "Rate limiting, API key management, and OAuth 2.0 for secure integrations.",
    },
    {
      icon: <FileCheck className="h-6 w-6" />,
      title: "Compliance",
      description:
        "GDPR compliant with SOC 2 Type II certification in progress.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Security & Trust
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your data security is our top priority. Learn about the measures
              we take to protect your information.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-12">
            {securityFeatures.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="text-primary">{feature.icon}</div>
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Data Protection</CardTitle>
              <CardDescription>
                How we protect your sensitive information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Data Encryption</h4>
                <p className="text-sm text-muted-foreground">
                  All personal and credential data is encrypted using AES-256
                  encryption both in transit and at rest. Our encryption keys
                  are managed through AWS Key Management Service (KMS).
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Access Controls</h4>
                <p className="text-sm text-muted-foreground">
                  Strict role-based access controls ensure that only authorized
                  personnel can access sensitive data. All access is logged and
                  monitored.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Data Retention</h4>
                <p className="text-sm text-muted-foreground">
                  We retain data only as long as necessary for business purposes
                  or as required by law. Users can request data deletion at any
                  time.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Compliance & Certifications</CardTitle>
              <CardDescription>
                Industry standards and regulations we adhere to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">GDPR Compliant</Badge>
                <Badge variant="secondary">SOC 2 Type II (In Progress)</Badge>
                <Badge variant="secondary">ISO 27001 (Planned)</Badge>
                <Badge variant="secondary">PCI DSS Level 1</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report a Security Issue</CardTitle>
              <CardDescription>
                Found a security vulnerability? We take security seriously and
                appreciate responsible disclosure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you discover a security vulnerability, please send an email
                to our security team at:
              </p>
              <p className="font-medium">contact@trustidity.com</p>
              <p className="text-sm text-muted-foreground mt-4">
                We will acknowledge your email within 24 hours and provide a
                detailed response within 72 hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
