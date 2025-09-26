"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Search, Shield, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PaymentStep } from "./payment-step";

// Nigerian credential types with their requirements
const CREDENTIAL_TYPES = {
  waec: {
    name: "WAEC (West African Examinations Council)",
    needsInstitution: false,
    fields: ["certificateNumber", "candidateName", "examYear"],
    example: "e.g., 1234567890",
  },
  jamb: {
    name: "JAMB (Joint Admissions and Matriculation Board)",
    needsInstitution: false,
    fields: ["registrationNumber", "candidateName", "examYear"],
    example: "e.g., 12345678AB",
  },
  neco: {
    name: "NECO (National Examinations Council)",
    needsInstitution: false,
    fields: ["certificateNumber", "candidateName", "examYear"],
    example: "e.g., NE123456789",
  },
  university: {
    name: "University Degree/Certificate",
    needsInstitution: true,
    fields: [
      "certificateNumber",
      "candidateName",
      "graduationYear",
      "institution",
    ],
    example: "e.g., UNN/2023/BSC/001234",
  },
  nmcn: {
    name: "Nursing and Midwifery Council of Nigeria",
    needsInstitution: false,
    fields: ["registrationNumber", "candidateName", "registrationYear"],
    example: "e.g., RN123456",
  },
  nysc: {
    name: "NYSC Discharge Certificate",
    needsInstitution: false,
    fields: ["stateCode", "candidateName", "serviceYear"],
    example: "e.g., LA/23A/1234",
  },
  professional: {
    name: "Professional Certification",
    needsInstitution: true,
    fields: ["certificateNumber", "candidateName", "issueYear", "institution"],
    example: "e.g., ICAN/2023/001234",
  },
};

export function VerifyDocument() {
  const [step, setStep] = useState<"select" | "form" | "payment" | "result">(
    "select"
  );
  const [selectedType, setSelectedType] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const router = useRouter();

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setFormData({});
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSuccess = async (reference: string) => {
    setIsLoading(true);

    // Simulate verification process after successful payment
    setTimeout(() => {
      const mockResult = {
        status: Math.random() > 0.3 ? "verified" : "not_found",
        paymentReference: reference,
        details: {
          candidateName: formData.candidateName,
          credentialType:
            CREDENTIAL_TYPES[selectedType as keyof typeof CREDENTIAL_TYPES]
              .name,
          issueDate:
            formData.examYear ||
            formData.graduationYear ||
            formData.registrationYear ||
            formData.serviceYear,
          institution:
            formData.institution ||
            CREDENTIAL_TYPES[selectedType as keyof typeof CREDENTIAL_TYPES]
              .name,
          verificationDate: new Date().toLocaleDateString(),
        },
      };

      setVerificationResult(mockResult);
      setIsLoading(false);
      setStep("result");
    }, 3000);
  };

  const handleLoginToSaveResult = () => {
    // Store verification result in sessionStorage to persist through login
    sessionStorage.setItem(
      "pendingVerification",
      JSON.stringify(verificationResult)
    );
    router.push("/login?redirect=verify-result");
  };

  if (step === "select") {
    return (
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Verify Your Credential
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the type of credential you want to verify. Our system
              supports major Nigerian educational and professional
              certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(CREDENTIAL_TYPES).map(([key, type]) => (
              <Card
                key={key}
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
                onClick={() => handleTypeSelect(key)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{type.name}</CardTitle>
                  <CardDescription>
                    {type.needsInstitution
                      ? "Requires institution details"
                      : "Direct verification available"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Click to verify
                    </span>
                    <Search className="h-4 w-4 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-600" />
                Secure & Confidential
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-blue-600" />
                Instant Results
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "form") {
    const credentialType =
      CREDENTIAL_TYPES[selectedType as keyof typeof CREDENTIAL_TYPES];

    return (
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setStep("select")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Selection
            </Button>

            <h1 className="text-2xl font-bold text-foreground mb-2">
              Verify {credentialType.name}
            </h1>
            <p className="text-muted-foreground">
              Enter the required information to verify your credential
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Verification Details</CardTitle>
              <CardDescription>
                All fields are required for accurate verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Certificate/Registration Number */}
                <div className="space-y-2">
                  <Label htmlFor="number">
                    {selectedType === "jamb"
                      ? "Registration Number"
                      : selectedType === "nysc"
                      ? "State Code/Number"
                      : "Certificate Number"}
                  </Label>
                  <Input
                    id="number"
                    placeholder={credentialType.example}
                    value={
                      formData.certificateNumber ||
                      formData.registrationNumber ||
                      formData.stateCode ||
                      ""
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [selectedType === "jamb"
                          ? "registrationNumber"
                          : selectedType === "nysc"
                          ? "stateCode"
                          : "certificateNumber"]: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                {/* Candidate Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name (as on certificate)</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name exactly as it appears"
                    value={formData.candidateName || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        candidateName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <Label htmlFor="year">
                    {selectedType === "university"
                      ? "Graduation Year"
                      : selectedType === "nmcn"
                      ? "Registration Year"
                      : selectedType === "nysc"
                      ? "Service Year"
                      : "Examination Year"}
                  </Label>
                  <Select
                    value={
                      formData.examYear ||
                      formData.graduationYear ||
                      formData.registrationYear ||
                      formData.serviceYear ||
                      ""
                    }
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        [selectedType === "university"
                          ? "graduationYear"
                          : selectedType === "nmcn"
                          ? "registrationYear"
                          : selectedType === "nysc"
                          ? "serviceYear"
                          : "examYear"]: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 30 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Institution (if needed) */}
                {credentialType.needsInstitution && (
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution Name</Label>
                    <Input
                      id="institution"
                      placeholder="e.g., University of Nigeria, Nsukka"
                      value={formData.institution || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          institution: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                )}

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">
                    Additional Information (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional details that might help with verification"
                    value={formData.notes || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Verify Credential
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    const credentialType =
      CREDENTIAL_TYPES[selectedType as keyof typeof CREDENTIAL_TYPES];

    return (
      <PaymentStep
        credentialType={selectedType}
        credentialName={credentialType.name}
        formData={formData}
        onBack={() => setStep("form")}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  if (step === "result") {
    return (
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card
            className={`border-2 ${
              verificationResult.status === "verified"
                ? "border-green-500"
                : "border-red-500"
            }`}
          >
            <CardHeader className="text-center">
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  verificationResult.status === "verified"
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                {verificationResult.status === "verified" ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <Search className="h-8 w-8 text-red-600" />
                )}
              </div>
              <CardTitle
                className={`text-2xl ${
                  verificationResult.status === "verified"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {verificationResult.status === "verified"
                  ? "Credential Verified!"
                  : "Credential Not Found"}
              </CardTitle>
              <CardDescription>
                {verificationResult.status === "verified"
                  ? "This credential has been successfully verified in our database."
                  : "We could not find this credential in our database. Please check the details and try again."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Candidate Name
                  </Label>
                  <p className="text-foreground">
                    {verificationResult.details.candidateName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Credential Type
                  </Label>
                  <p className="text-foreground">
                    {verificationResult.details.credentialType}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Institution
                  </Label>
                  <p className="text-foreground">
                    {verificationResult.details.institution}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Issue Date
                  </Label>
                  <p className="text-foreground">
                    {verificationResult.details.issueDate}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Verification Date
                  </Label>
                  <p className="text-foreground">
                    {verificationResult.details.verificationDate}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Payment Reference
                  </Label>
                  <p className="text-foreground">
                    {verificationResult.paymentReference}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Want to save this result or verify more credentials?
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleLoginToSaveResult} className="flex-1">
                    Login to Save Result
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStep("select")}
                    className="flex-1"
                  >
                    Verify Another
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
