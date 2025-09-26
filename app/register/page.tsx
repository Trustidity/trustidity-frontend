import { RegisterForm } from "@/components/auth/register-form"
import { Shield } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground p-12 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8" />
            <span className="text-2xl font-bold">Trustidity</span>
          </Link>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-balance">Start verifying credentials today</h1>
          <p className="text-lg text-primary-foreground/80 text-pretty">
            Create your account and join the global network of trusted credential verification.
          </p>
        </div>

        <div className="text-sm text-primary-foreground/60">© 2025 Trustidity. All rights reserved.</div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="lg:hidden mb-8">
              <Link href="/" className="flex items-center justify-center space-x-2">
                <Shield className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">Trustidity</span>
              </Link>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Create your account</h2>
            <p className="mt-2 text-muted-foreground">Get started with Trustidity</p>
          </div>

          <RegisterForm />

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
