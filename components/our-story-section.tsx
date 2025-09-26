import { Target, Heart, Globe2 } from "lucide-react";

export function OurStorySection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              The Trustidity Story
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Born from a simple but powerful idea: What if verifying a
              certificate was as easy as scanning a code?
            </p>
          </div>

          <div className="prose prose-lg mx-auto text-muted-foreground mb-16">
            <p className="text-center text-xl leading-relaxed">
              For decades, fake certificates and forged documents have been a
              hidden cancer in our education and employment systems.
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-12 not-prose">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p>
                    Employers hire unqualified staff based on forged degrees
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p>Embassies process visas with fraudulent transcripts</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p>
                    Universities unknowingly admit students with fake
                    credentials
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p>
                    Genuine graduates wait endlessly for manual verifications
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-xl font-semibold text-foreground">
              This isn't just an inconvenience — it's a global trust problem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Our Mission
              </h3>
              <p className="text-muted-foreground">
                To make trust borderless by creating a secure, digital layer of
                verification that connects schools, governments, employers, and
                individuals across the globe.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mx-auto mb-6">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Why It Matters
              </h3>
              <p className="text-muted-foreground">
                Every fake certificate hurts genuine graduates. Every delayed
                verification slows down a dream. Every fraud damages
                institutional reputation.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mx-auto mb-6">
                <Globe2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                The Future We're Building
              </h3>
              <p className="text-muted-foreground">
                A world where no graduate loses an opportunity because of
                "delayed verification" and the question "Is this certificate
                real?" never holds back a career again.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <p className="text-xl font-semibold text-primary">
              Trustidity restores confidence, speed, and fairness to the system
              — so real talent shines and trust becomes the new default.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
