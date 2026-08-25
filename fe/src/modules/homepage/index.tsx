"use client";

import { useEffect, useState } from "react";
import EventsSection from "@/modules/homepage/sections/events-section";
import HeroSection from "@/modules/homepage/sections/hero-section";
import NewsSection from "@/modules/homepage/sections/news-section";
import ResearchSection from "@/modules/homepage/sections/research-section";
import { apiRequest, type HomepageContent } from "@/lib/api";

export default function HomePage() {
  const [content, setContent] = useState<HomepageContent | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    apiRequest<HomepageContent>("content/home", { signal: controller.signal })
      .then(setContent)
      .catch(() => {
        if (!controller.signal.aborted) setContent(null);
      });

    return () => controller.abort();
  }, []);

  return (
    <main id="main-content">
      <HeroSection settings={content?.settings} />
      <ResearchSection />
      <NewsSection items={content?.news || []} archiveUrl={content?.settings.news_archive_url} />
      <EventsSection items={content?.events || []} archiveUrl={content?.settings.events_archive_url} />
    </main>
  );
}
