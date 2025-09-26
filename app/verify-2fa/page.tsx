import { TwoFactorVerificationForm } from "@/components/auth/two-factor-verification-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function Verify2FAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Login Link */}
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>

        {/* Main Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Enter the 6-digit code from your authenticator app to complete
              your login.
            </CardDescription>
          </CardHeader>
          <CardContent>{/* <TwoFactorVerificationForm /> */}</CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          Having trouble?{" "}
          <Link
            href="/support"
            className="font-medium text-primary hover:underline"
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
