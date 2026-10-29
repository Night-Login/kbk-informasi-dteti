"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import HeroSection from "./sections/hero-section";
import ResearchSection from "./sections/research-section";
import { ArticleCard, EventCard, NewsCard } from "./components/content-cards";
import { apiRequest, type HomepageContent } from "@/lib/api";
import { previewContent } from "./data/preview.data";
const tabs = ["Article", "Events", "News"] as const;
type Tab = typeof tabs[number];
export default function HomePage() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [tab, setTab] = useState<Tab>("Article");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [preview, setPreview] = useState(false);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  useEffect(() => {
    const controller = new AbortController();
    if (new URLSearchParams(window.location.search).get("preview") === "1") {
      Promise.resolve().then(() => { setPreview(true); setContent(previewContent); setLoading(false); });
      return () => controller.abort();
    }
    apiRequest<HomepageContent>("content/home", { signal: controller.signal })
      .then(setContent)
      .catch(() => { if (!controller.signal.aborted) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);
  const news = content?.news || [];
  const events = content?.events || [];
  const empty = tab === "Events" ? events.length === 0 : news.length === 0;
  function navigateTabs(event: KeyboardEvent, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault(); setTab(tabs[next]); buttons.current[next]?.focus();
  }
  return <main id="main-content" className="discovery-page">
    <HeroSection /><ResearchSection />
    {preview && <p className="discovery-preview-notice">Design preview · Sample content, not official event information. <button type="button" onClick={() => window.location.assign("/")}>Exit preview</button></p>}
    <div className="discovery-tabs" role="tablist" aria-label="Explore updates">{tabs.map((item, index) => <button key={item} ref={(element) => { buttons.current[index] = element; }} id={`tab-${item}`} role="tab" aria-controls={`panel-${item}`} aria-selected={tab === item} tabIndex={tab === item ? 0 : -1} onClick={() => setTab(item)} onKeyDown={(event) => navigateTabs(event, index)}>{item}</button>)}</div>
    <section id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0} className="discovery-content discovery-container" aria-busy={loading}>
      {loading ? <div className="discovery-state" role="status">Loading updates…<div className="discovery-skeleton" aria-hidden="true" /></div>
        : error ? <div className="discovery-state" role="alert"><h2>Updates are temporarily unavailable</h2><p>Please try again to load the latest articles and events.</p><button className="discovery-button" onClick={() => { setLoading(true); setError(false); setAttempt(attempt + 1); }}>Try again</button></div>
        : empty ? <div className="discovery-state"><h2>No {tab.toLowerCase()} yet</h2><p>Published updates will appear here.</p></div>
        : <div key={tab} className="discovery-panel-enter">
          {tab === "Article" && <div className="discovery-article-feed">{news.slice(0, 2).map((article) => <ArticleCard key={article.id} article={article} preview={preview} />)}</div>}
          {tab === "Events" && <div className="discovery-event-grid">{events.slice(0, 8).map((event) => <EventCard key={event.id} event={event} />)}</div>}
          {tab === "News" && <><NewsCard article={news[0]} featured preview={preview} /><div className="discovery-news-grid">{news.slice(1, 5).map((article) => <NewsCard key={article.id} article={article} preview={preview} />)}</div></>}
          <div className="discovery-explore"><Link className="discovery-button" href={tab === "Events" ? (preview ? "/events?preview=1" : content?.settings.events_archive_url || "/events") : content?.settings.news_archive_url || "/news"}>Explore More<span className="sr-only"> {tab}</span></Link></div>
        </div>}
    </section>
    {tabs.filter((item) => item !== tab).map((item) => <section key={item} id={`panel-${item}`} role="tabpanel" aria-labelledby={`tab-${item}`} hidden />)}
  </main>;
}
