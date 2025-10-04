import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AboutHero } from "@/components/about/about-hero";
import { MissionSection } from "@/components/about/mission-section";
import { TeamSection } from "@/components/about/team-section";
import { StatsSection } from "@/components/about/stats-section";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <AboutHero />
        <MissionSection />
        <StatsSection />
        {/* <TeamSection /> */}
      </main>
      <Footer />
    </div>
  );
}
