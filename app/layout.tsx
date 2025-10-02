import type React from "react";
import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { ClientAuthProvider } from "@/components/auth/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Trustidity - Verify Academic & Professional Credentials Instantly",
  description:
    "Secure, fast, and reliable credential verification platform for individuals, employers, and institutions worldwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmMono.variable} antialiased`}
    >
      <body className="font-sans">
        <ClientAuthProvider>
          {children}
          <Toaster />
          <SpeedInsights />
        </ClientAuthProvider>
      </body>
    </html>
  );
}
