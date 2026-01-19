import LandingHero from "@/components/elements/landing-hero";
import AiExperience from "@/components/sections/ai-experience";
import CharacterMarket from "@/components/sections/character-market";
import BuildUniverses from "@/components/sections/build-universes";
import CommunityForums from "@/components/sections/community-forums";
import DownloadSection from "@/components/sections/download-section";
import TrustTransparency from "@/components/sections/trust-transparency";
import AboutSection from "@/components/sections/about-section";
import BlogSection from "@/components/sections/blog-section";
import CtaSection from "@/components/sections/cta-section";
import HealthCompanion from "@/components/sections/health-compamion";

export default function Home() {

  return (
    <>
      <LandingHero />
      <section id="about" className="w-full">
        <AboutSection />
      </section>
      <HealthCompanion />
      <AiExperience />
      <section id="market" className="w-full">
        <CharacterMarket />
      </section>
      <BuildUniverses />
      <section id="forum" className="w-full">
        <CommunityForums />
      </section>
      <section id="blog" className="w-full">
        <BlogSection />
      </section>
      <DownloadSection />
      <TrustTransparency />
      <CtaSection />
    </>
  );
}
