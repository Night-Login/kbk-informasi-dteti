import type { HomepageContent } from "@/lib/api";

// Explicit ?preview=1 only. Illustrative content from the supplied wireframe;
// never substituted for published API content or written to the database.
const titles = ["Kiro × Agentic AI: Build, Code & Compete", "Blood Donation & Health Screening", "Islamic Techfest 2026: Public Lecture", "Road to IDBW 2026: Beyond the Rupiah"];
export const previewContent: HomepageContent = {
  settings: {},
  news: Array.from({ length: 5 }, (_, index) => ({
    id: `preview-news-${index}`, slug: `preview-news-${index}`,
    title: titles[index % titles.length], published_at: "2026-09-16T10:25:00+07:00",
    excerpt: "Sample content for reviewing the landing page layout. Article summaries, event information, and updates from the research group will appear here.",
  })),
  events: Array.from({ length: 8 }, (_, index) => ({
    id: `preview-event-${index}`, slug: `preview-event-${index}`,
    title: titles[index % titles.length], starts_at: index < 4 ? "2026-07-15T09:00:00+07:00" : "2027-07-15T09:00:00+07:00",
    location: "Multimedia Room, 3rd Floor, UGM Central Building",
    description: "Sample event information for the design preview. This schedule is not an official event announcement.",
  })),
};
