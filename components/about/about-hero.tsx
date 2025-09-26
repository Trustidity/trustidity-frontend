import { Shield } from "lucide-react"

export function AboutHero() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">
            Building trust in credentials worldwide
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground text-pretty">
            Trustidity was founded with a simple mission: to eliminate credential fraud and build a more trustworthy
            world through instant, secure verification of academic and professional achievements.
          </p>
        </div>
      </div>
    </section>
  )
}
