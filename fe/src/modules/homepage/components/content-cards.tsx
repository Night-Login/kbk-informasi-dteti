"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3, MapPin, Share2 } from "lucide-react";
import { useState } from "react";
import type { NewsArticle, WebsiteEvent } from "@/lib/api";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });
const timeFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta" });
export function displayDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Date to be announced" : dateFormat.format(date); }

export function EventCard({ event }: { event: WebsiteEvent }) {
  const start = new Date(event.starts_at);
  const end = event.ends_at ? new Date(event.ends_at) : null;
  const endLabel = end && !Number.isNaN(end.getTime()) ? `${displayDate(event.starts_at) !== displayDate(event.ends_at!) ? `${displayDate(event.ends_at!)} · ` : ""}${timeFormat.format(end)} WIB` : null;
  return <article id={event.slug} className="discovery-event-card">
    <div className="discovery-media" aria-hidden="true" />
    <h3>{event.link_url ? <a href={event.link_url}>{event.title}</a> : event.title}</h3>
    <dl>
      <div><CalendarDays size={17} aria-hidden="true" /><dt className="sr-only">Date</dt><dd><time dateTime={event.starts_at}>{displayDate(event.starts_at)}</time></dd></div>
      <div><Clock3 size={17} aria-hidden="true" /><dt className="sr-only">Time</dt><dd>{Number.isNaN(start.getTime()) ? "To be announced" : `${timeFormat.format(start)} WIB`}{endLabel && ` – ${endLabel}`}</dd></div>
      <div><MapPin size={17} aria-hidden="true" /><dt className="sr-only">Location</dt><dd>{event.location || "Location to be announced"}</dd></div>
    </dl>
    {event.description && <details className="discovery-event-details"><summary>Event details</summary><p>{event.description}</p></details>}
  </article>;
}

export function NewsCard({ article, featured = false, preview = false }: { article: NewsArticle; featured?: boolean; preview?: boolean }) {
  return <article className={`discovery-news-card ${featured ? "discovery-news-featured" : ""}`}>
    {preview ? <div className="discovery-media" aria-hidden="true" /> : <Link href={`/news/${article.slug}`} tabIndex={-1} aria-hidden="true" className="discovery-media" />}
    <div className="discovery-news-copy"><span className="discovery-tag">DTETI UGM</span><h3>{preview ? article.title : <Link href={`/news/${article.slug}`}>{article.title}</Link>}</h3><time dateTime={article.published_at}>{displayDate(article.published_at)}</time>{featured && <p>{article.excerpt}</p>}</div>
  </article>;
}

export function ArticleCard({ article, preview = false }: { article: NewsArticle; preview?: boolean }) {
  const [message, setMessage] = useState("");
  async function share() {
    const url = new URL(`/news/${article.slug}`, window.location.origin).href;
    try {
      if (navigator.share) await navigator.share({ title: article.title, url });
      else { await navigator.clipboard.writeText(url); setMessage("Link copied"); }
    } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setMessage("Could not share. Open the article to copy its URL."); }
  }
  return <article className="discovery-article-card">
    <div className="discovery-author"><span className="discovery-avatar" aria-hidden="true" /><div><strong>DTETI UGM</strong><time dateTime={article.published_at}>{displayDate(article.published_at)}</time></div></div>
    <h3>{preview ? article.title : <Link href={`/news/${article.slug}`}>{article.title}</Link>}</h3><p>{article.excerpt}</p>
    {preview ? <div className="discovery-media" aria-hidden="true" /> : <Link className="discovery-media" href={`/news/${article.slug}`} tabIndex={-1} aria-hidden="true" />}
    <div className="discovery-article-actions">{preview ? <span>Preview article</span> : <><Link href={`/news/${article.slug}`}>Read article <ArrowUpRight size={16} aria-hidden="true" /></Link><button onClick={share} className="discovery-icon-button" aria-label={`Share ${article.title}`}><Share2 size={19} /></button></>}</div>
    {message && <p role="status" className="discovery-share-status">{message}</p>}
  </article>;
}
