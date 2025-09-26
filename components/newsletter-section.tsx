"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setIsSubmitted(true)
    setEmail("")
  }

  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Mail className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Stay Updated</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get the latest updates on credential verification trends and platform features
          </p>

          {isSubmitted ? (
            <div className="mt-8 rounded-lg bg-green-50 p-4 text-green-800">
              Thank you for subscribing! Check your email for confirmation.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
