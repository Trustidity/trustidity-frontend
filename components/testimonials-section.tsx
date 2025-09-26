import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "HR Director, TechCorp",
      content:
        "Trustidity has revolutionized our hiring process. We can now verify candidates' credentials instantly, saving us weeks of manual verification.",
      rating: 5,
    },
    {
      name: "Dr. Michael Chen",
      role: "Admissions Officer, Stanford University",
      content:
        "The platform's accuracy and speed are unmatched. We've eliminated credential fraud completely since implementing Trustidity.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "International Student",
      content:
        "As an international student, Trustidity made it so easy to verify my degrees for university applications. Highly recommended!",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Trusted by Thousands</h2>
          <p className="mt-4 text-lg text-muted-foreground">See what our users say about Trustidity</p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="rounded-2xl border bg-card p-8 shadow-sm">
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 text-pretty">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
