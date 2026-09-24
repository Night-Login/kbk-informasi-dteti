"use client";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Breadcrumbs from "@/components/global/breadcrumbs";
import { apiRequest, type WebsiteEvent } from "@/lib/api";
import { EventCard } from "@/modules/homepage/components/content-cards";
import { previewContent } from "@/modules/homepage/data/preview.data";
const monthFormatter = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
function EventCalendar({ events }: { events: WebsiteEvent[] }) {
  const today = new Date();
  const [month, setMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || events.length === 0) return;
    const now = Date.now();
    const target =
      events.find((event) => new Date(event.starts_at).getTime() >= now) ||
      events[0];
    const targetDate = new Date(target.starts_at);
    setMonth(new Date(targetDate.getFullYear(), targetDate.getMonth(), 1));
    initialized.current = true;
  }, [events]);

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const leadingEmptyDays = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const eventDays = new Map<number, WebsiteEvent[]>();

  events.forEach((event) => {
    const date = new Date(event.starts_at);
    if (date.getFullYear() !== year || date.getMonth() !== monthIndex) return;
    const existing = eventDays.get(date.getDate()) || [];
    existing.push(event);
    eventDays.set(date.getDate(), existing);
  });

  const cells: Array<number | null> = [
    ...Array.from({ length: leadingEmptyDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <aside className="rounded-xl border border-line bg-surface p-5 sm:p-6 xl:sticky xl:top-28">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-dteti-ink">Calendar</h2>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}
            className="grid size-9 place-items-center rounded-lg border border-line bg-white text-dteti-blue hover:border-dteti-blue"
          >
            <ArrowLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}
            className="grid size-9 place-items-center rounded-lg border border-line bg-white text-dteti-blue hover:border-dteti-blue"
          >
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="mt-4 text-sm font-bold text-dteti-blue">
        {monthFormatter.format(month)}
      </p>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="py-2 font-bold text-muted">
            {day}
          </div>
        ))}
        {cells.map((day, index) => {
          const dayEvents = day ? eventDays.get(day) || [] : [];
          return (
            <div
              key={`${day || "empty"}-${index}`}
              title={dayEvents.map((event) => event.title).join(" · ")}
              className={[
                "grid min-h-11 place-items-center rounded-lg border text-sm font-semibold",
                day === null
                  ? "border-transparent"
                  : dayEvents.length > 0
                    ? "border-dteti-yellow bg-dteti-yellow text-dteti-ink"
                    : "border-line bg-white text-ink",
              ].join(" ")}
            >
              {day}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted">
        Dates highlighted in yellow have one or more published events.
      </p>
    </aside>
  );
}

export default function EventsPage() {
  const [items, setItems] = useState<WebsiteEvent[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [referenceTime] = useState(() => Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    if (new URLSearchParams(window.location.search).get("preview") === "1") {
      Promise.resolve().then(() => { setPreview(true); setItems(previewContent.events); setLoading(false); });
      return () => controller.abort();
    }
    apiRequest<WebsiteEvent[]>("content/events", { query: { limit: 100 }, signal: controller.signal })
      .then(setItems)
      .catch(() => { if (!controller.signal.aborted) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);
  const visibleItems = useMemo(() => items.filter((item) => {
    const matchesQuery = [item.title, item.description || "", item.location].join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
    const endTime = new Date(item.ends_at || item.starts_at).getTime();
    return matchesQuery && (status === "all" || (status === "upcoming" && endTime >= referenceTime) || (status === "past" && endTime < referenceTime));
  }), [items, query, status, referenceTime]);
  return <main id="main-content" className="discovery-page discovery-events-page">
    <div className="discovery-container">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Events" }]} />
      <header className="discovery-events-heading"><h1>Events</h1></header>
      {preview && <p className="discovery-preview-notice">Design preview · Sample content, not an official schedule. <button type="button" onClick={() => window.location.assign("/events")}>Exit preview</button></p>}
      <div className="discovery-events-toolbar">
        <form className="discovery-events-search" role="search" onSubmit={(event) => event.preventDefault()}><Search size={20} aria-hidden="true" /><label htmlFor="event-search" className="sr-only">Search events or locations</label><input id="event-search" type="search" placeholder="Search events or locations" value={query} onChange={(event) => setQuery(event.target.value)} /></form>
        <label className="sr-only" htmlFor="event-status">Filter events</label><select id="event-status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All events</option><option value="upcoming">Upcoming</option><option value="past">Past events</option></select>
      </div>
      {loading ? <div className="discovery-state" role="status">Loading events…</div> : error ? <div className="discovery-state" role="alert"><h2>Events are temporarily unavailable</h2><p>Please try again to load the event schedule.</p><button className="discovery-button" onClick={() => { setError(false); setLoading(true); setAttempt(attempt + 1); }}>Try again</button></div> : <>
        <p className="mb-5 text-sm" role="status">{visibleItems.length} {visibleItems.length === 1 ? "event" : "events"}</p>
        {visibleItems.length ? <div className="discovery-event-grid">{visibleItems.map((event) => <EventCard key={event.id} event={event} />)}</div> : <div className="discovery-state"><h2>No events found</h2><p>{items.length ? "Try another keyword or event status." : "Published events will appear here."}</p>{items.length > 0 && <button className="discovery-button" onClick={() => { setQuery(""); setStatus("all"); }}>Clear filters</button>}</div>}
        <details className="discovery-calendar"><summary>View event calendar</summary><EventCalendar events={visibleItems} /></details>
      </>}
    </div>
  </main>;
}
