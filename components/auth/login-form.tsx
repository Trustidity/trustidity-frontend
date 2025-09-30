"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, X, User, Shield, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { PasswordInput } from "@/components/ui/password-input";

// Demo credentials data
const demoCredentials = [
  {
    id: "super-admin",
    title: "Super Admin",
    description: "Full system administration access",
    email: "admin@trustidity.com",
    password: "TrustidityAdmin2024!",
    icon: Shield,
    role: "admin",
  },
  {
    id: "institution-admin",
    title: "Institution Admin",
    description: "University of Lagos administrator",
    email: "jane.smith@university.edu.ng",
    password: "TestPassword123!",
    icon: GraduationCap,
    role: "institution",
  },
  {
    id: "regular-user",
    title: "Regular User",
    description: "Standard user account",
    email: "john.doe@example.com",
    password: "TestPassword123!",
    icon: User,
    role: "individual",
  },
  {
    id: "employer",
    title: "Employer",
    description: "Tech Solutions Ltd employer account",
    email: "employer@techsolutions.com",
    password: "TestPassword123!",
    icon: User,
    role: "employer",
  },
];

export function LoginForm() {
  const [email, setEmail] = useState("jane.smith@university.edu.ng");
  const [password, setPassword] = useState("TestPassword123!");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDemoPanel, setShowDemoPanel] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (credentials: (typeof demoCredentials)[0]) => {
    setEmail(credentials.email);
    setPassword(credentials.password);
    setShowDemoPanel(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-muted-foreground"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a
              href="/forgot-password"
              className="font-medium text-primary hover:underline"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign in
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => setShowDemoPanel(true)}
          disabled={isLoading}
        >
          Try demo login
        </Button>
      </form>

      {/* ... existing demo panel code ... */}
      {showDemoPanel && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowDemoPanel(false)}
          />

          {/* Sliding Panel */}
          <div className="fixed right-0 top-0 h-full w-96 bg-background border-l shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold">
                  Demo Login Credentials
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDemoPanel(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-sm text-muted-foreground mb-6">
                  Choose a demo account to test different user roles and
                  features.
                </p>

                <div className="space-y-4">
                  {demoCredentials.map((credential) => {
                    const IconComponent = credential.icon;
                    return (
                      <div
                        key={credential.id}
                        className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">
                              {credential.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {credential.description}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="font-medium">Email:</span>
                            <div className="font-mono bg-muted px-2 py-1 rounded mt-1">
                              {credential.email}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Password:</span>
                            <div className="font-mono bg-muted px-2 py-1 rounded mt-1">
                              {credential.password}
                            </div>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleDemoLogin(credential)}
                        >
                          Use this account
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
