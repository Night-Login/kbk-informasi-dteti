import EventsSection from "@/modules/homepage/sections/events-section";
import HeroSection from "@/modules/homepage/sections/hero-section";
import NewsSection from "@/modules/homepage/sections/news-section";
import ResearchSection from "@/modules/homepage/sections/research-section";

export default function HomePage() {
  return (
    <main id="main-content">
      <HeroSection />
      <ResearchSection />
      <NewsSection />
      <EventsSection />
    </main>
  );
}
