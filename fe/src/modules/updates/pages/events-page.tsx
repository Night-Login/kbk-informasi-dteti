"use client";

import DiscoveryPageHero from "@/components/global/discovery-page-hero";
import { apiRequest, getApiAssetUrl, type WebsiteEvent } from "@/lib/api";
import { previewContent } from "@/modules/homepage/data/preview.data";
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  LoaderCircle,
  MapPin,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const dateSeparatorFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Jakarta",
});

function toDateKey(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "unknown";
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Jakarta",
  }).formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value ?? "0000";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${year}-${month}-${day}`;
}

function formatEventTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "To be announced";
  return timeFormatter
    .format(date)
    .replace(":", ".")
    .replace("AM", "A.M.")
    .replace("PM", "P.M.");
}

function formatDateSeparator(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to be announced";
  return dateSeparatorFormatter.format(date);
}

function getEventTags(event: WebsiteEvent): string[] {
  const text = `${event.title} ${event.description || ""}`.toLowerCase();
  const matched: string[] = [];
  if (text.includes("ai") || text.includes("agentic") || text.includes("intelligent")) {
    matched.push("Artificial Intelligence");
  }
  if (text.includes("data")) {
    matched.push("Data Science", "Big Data");
  }
  if (text.includes("cyber") || text.includes("security")) {
    matched.push("Cyber Security");
  }
  if (text.includes("software") || text.includes("code") || text.includes("build")) {
    matched.push("Software Engineering");
  }
  if (matched.length === 0) {
    return ["Data Science", "Big Data"];
  }
  return matched.slice(0, 2);
}

function EventCalendar({
  events,
  selectedDateKey,
  onSelectDateKey,
  todayDateKey,
}: {
  events: WebsiteEvent[];
  selectedDateKey: string | null;
  onSelectDateKey: (dateKey: string | null) => void;
  todayDateKey: string;
}) {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const leadingEmptyDays = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const eventDays = new Map<number, { events: WebsiteEvent[]; dateKey: string }>();

  events.forEach((event) => {
    const date = new Date(event.starts_at);
    if (date.getFullYear() !== year || date.getMonth() !== monthIndex) return;
    const dayNumber = date.getDate();
    const dateKey = toDateKey(date);
    const existing = eventDays.get(dayNumber) || { events: [], dateKey };
    existing.events.push(event);
    eventDays.set(dayNumber, existing);
  });

  const cells: Array<number | null> = [
    ...Array.from({ length: leadingEmptyDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <aside
      aria-label="Event calendar"
      className="discovery-stagger-card w-full max-w-[408px] border border-[#bfbfbf] bg-[#f5f5f5] p-[32px]"
    >
      <h2 className="text-[25px] font-semibold leading-[36px] text-[#1a4872]">
        {monthFormatter.format(month)}
      </h2>

      <div className="mt-[16px] flex items-center gap-[20px] text-[16px] font-medium leading-[23px] text-[#1a4872]">
        <button
          type="button"
          onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}
          className="cursor-pointer transition-opacity hover:opacity-75"
        >
          ‹ Previous
        </button>
        <button
          type="button"
          onClick={() => {
            const now = new Date();
            setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
            onSelectDateKey(null);
          }}
          className="cursor-pointer transition-opacity hover:opacity-75"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}
          className="cursor-pointer transition-opacity hover:opacity-75"
        >
          Next ›
        </button>
      </div>

      <div className="mt-[16px] grid grid-cols-7 gap-x-[6px] text-[14px] font-semibold leading-[44px] text-[#404040]">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
          <div key={`${day}-${idx}`} className="h-[44px] w-[44px]">
            {day}
          </div>
        ))}
      </div>

      <div className="mt-[16px] grid grid-cols-7 gap-x-[6px] gap-y-[16px] text-[14px] leading-[44px]">
        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-[44px] w-[44px]" />;
          }
          const cellDateKey = toDateKey(new Date(year, monthIndex, day));
          const isToday = cellDateKey === todayDateKey;
          const entry = eventDays.get(day);
          const hasEvents = Boolean(entry && entry.events.length > 0);
          const isSelected = Boolean(
            entry && selectedDateKey && entry.dateKey === selectedDateKey,
          );

          if (!hasEvents || !entry) {
            return (
              <div
                key={`day-${day}`}
                title={isToday ? "Today" : undefined}
                className={`h-[44px] w-[44px] font-normal ${
                  isToday
                    ? "rounded-[4px] border border-[#1a4872] px-1.5 font-semibold text-[#1a4872]"
                    : "text-[#404040]"
                }`}
              >
                {day}
              </div>
            );
          }

          return (
            <button
              key={`day-${day}`}
              type="button"
              onClick={() =>
                onSelectDateKey(isSelected ? null : entry.dateKey)
              }
              title={entry.events.map((event) => event.title).join(" · ")}
              aria-pressed={isSelected}
              className={`h-[44px] w-[44px] cursor-pointer text-left font-semibold transition-colors ${
                isSelected
                  ? "rounded-[4px] bg-[#1a4872] px-1.5 text-white"
                  : isToday
                    ? "rounded-[4px] border border-[#1a4872] px-1.5 text-[#1a4872]"
                    : "text-[#0d0d0d] hover:text-[#1a4872]"
              }`}
            >
              {day} •
            </button>
          );
        })}
      </div>

      <p className="mt-[16px] text-[14px] font-normal leading-[20px] text-[#595959]">
        • Event scheduled &nbsp; · &nbsp; Select a marked date
      </p>
    </aside>
  );
}

function EventGridCard({
  event,
  index = 0,
}: {
  event: WebsiteEvent;
  index?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const image = getApiAssetUrl(event.media?.file_url || event.image_url);
  const tags = getEventTags(event);

  return (
    <article
      id={event.slug}
      style={{ "--card-index": index } as React.CSSProperties}
      className="discovery-stagger-card discovery-card-lift flex min-h-[435px] flex-col justify-between rounded-[8px] bg-[#e6ecf2] p-[16px] pt-[17px] pb-[18px] scroll-mt-24"
    >
      <div>
        <div className="h-[216px] w-full overflow-hidden rounded-[4px] bg-white">
          {image ? (
            <img
              src={image}
              alt={event.media?.alt_text || event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src="/images/hero-campus.jpg"
              alt={event.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="mt-[13px] flex flex-col gap-[8px]">
          <h3 className=" line-clamp-2 text-[20px] font-bold leading-[23px] text-[#1a4872]">
            {event.link_url ? (
              <a href={event.link_url} className="hover:underline">
                {event.title}
              </a>
            ) : (
              event.title
            )}
          </h3>

          <div className="flex flex-col gap-[8px] text-[16px] text-[#1a4872]">
            <div className="flex items-start gap-[8px]">
              <Clock3
                size={20}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-[#1a4872]"
              />
              <span>{formatEventTime(event.starts_at)}</span>
            </div>

            <div className="flex items-start gap-[8px]">
              <MapPin
                size={20}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-[#1a4872]"
              />
              <span className="line-clamp-1">
                {event.location || "Location to be announced"}
              </span>
            </div>
          </div>

          <div className="mt-[4px] flex flex-wrap items-center gap-[16px]">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center justify-center rounded-[4px] border border-[#1a4872] bg-white px-[8px] py-[4px] text-[16px] font-medium leading-normal text-[#1a4872]"
              >
                {tag}
              </span>
            ))}
          </div>

          {expanded && event.description && (
            <p className="mt-2 rounded-[4px] bg-white/80 p-3 text-sm leading-relaxed text-[#151729]">
              {event.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-[16px] pl-[3px]">
        {event.link_url ? (
          <a
            href={event.link_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-[36px] w-[166px] items-center justify-center gap-[4px] rounded-[8px] border border-[#1a4872] bg-white text-[16px] font-medium text-[#1a4872] transition-colors hover:bg-[#1a4872] hover:text-white"
          >
            <span>View Event</span>
            <ArrowRight size={20} aria-hidden="true" />
          </a>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            className="inline-flex h-[36px] w-[166px] cursor-pointer items-center justify-center gap-[4px] rounded-[8px] border border-[#1a4872] bg-white text-[16px] font-medium text-[#1a4872] transition-colors hover:bg-[#1a4872] hover:text-white"
          >
            <span>{expanded ? "Hide Event" : "View Event"}</span>
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  );
}

export default function EventsPage() {
  const [items, setItems] = useState<WebsiteEvent[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [format, setFormat] = useState("all");
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [todayDateKey] = useState(() => toDateKey(new Date()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    if (new URLSearchParams(window.location.search).get("preview") === "1") {
      Promise.resolve().then(() => {
        setPreview(true);
        setItems(previewContent.events);
        setLoading(false);
      });
      return () => controller.abort();
    }

    apiRequest<WebsiteEvent[]>("content/events", {
      query: { limit: 100 },
      signal: controller.signal,
    })
      .then(setItems)
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [attempt]);

  const visibleItems = useMemo(() => {
    return items
      .filter((item) => {
        const text = [item.title, item.description || "", item.location]
          .join(" ")
          .toLocaleLowerCase();
        const matchesQuery = text.includes(query.trim().toLocaleLowerCase());
        const eventEndDateKey = toDateKey(item.ends_at || item.starts_at);
        const isUpcomingOrCurrent = eventEndDateKey >= todayDateKey;
        const matchesStatus =
          Boolean(selectedDateKey) ||
          status === "all" ||
          (status === "upcoming" && isUpcomingOrCurrent) ||
          (status === "past" && !isUpcomingOrCurrent);

        const locationLower = (item.location || "").toLocaleLowerCase();
        const isOnline =
          locationLower.includes("zoom") ||
          locationLower.includes("online") ||
          locationLower.includes("virtual") ||
          locationLower.includes("webinar");
        const matchesFormat =
          format === "all" ||
          (format === "online" && isOnline) ||
          (format === "offline" && !isOnline);

        const matchesDate =
          !selectedDateKey || toDateKey(item.starts_at) === selectedDateKey;

        return matchesQuery && matchesStatus && matchesFormat && matchesDate;
      })
      .toSorted(
        (first, second) =>
          new Date(second.starts_at).getTime() -
          new Date(first.starts_at).getTime(),
      );
  }, [items, query, status, format, selectedDateKey, todayDateKey]);

  const groupedEvents = useMemo(() => {
    const groups: Array<{
      dateKey: string;
      label: string;
      events: WebsiteEvent[];
    }> = [];
    const map = new Map<
      string,
      { dateKey: string; label: string; events: WebsiteEvent[] }
    >();

    visibleItems.forEach((event) => {
      const dateKey = toDateKey(event.starts_at);
      let group = map.get(dateKey);
      if (!group) {
        group = {
          dateKey,
          label: formatDateSeparator(event.starts_at),
          events: [],
        };
        map.set(dateKey, group);
        groups.push(group);
      }
      group.events.push(event);
    });

    return groups;
  }, [visibleItems]);

  function clearFilters() {
    setQuery("");
    setStatus("upcoming");
    setFormat("all");
    setSelectedDateKey(null);
  }

  return (
    <main
      id="main-content"
      className="discovery-page min-h-screen bg-white pb-20 text-[#151729]"
    >
      <DiscoveryPageHero title="Events" />

      {preview && (
        <p className="discovery-preview-notice">
          Design preview · Sample content, not an official schedule.{" "}
          <button
            type="button"
            onClick={() => window.location.assign("/events")}
          >
            Exit preview
          </button>
        </p>
      )}

      <div className="mx-auto max-w-[1440px] px-6 pt-[27px] lg:px-[72px]">
        <div className="flex flex-col items-start justify-between gap-10 xl:flex-row xl:gap-[64px]">
          {/* Left Column: Filters + Date-Grouped Event Feed */}
          <div className="w-full flex-1 xl:max-w-[840px]">
            {/* Filter Row (4:534) */}
            <div
              role="region"
              aria-label="Event filters"
              className="mt-[8px] flex flex-wrap items-center gap-[16px]"
            >
              <div className="relative h-[56px] w-[210px]">
                <label htmlFor="event-status" className="sr-only">
                  Filter events by type
                </label>
                <select
                  id="event-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="h-full w-full appearance-none border border-[#1a4872] bg-white px-[16px] pr-9 text-[16px] text-[#1a4872] outline-none"
                >
                  <option value="upcoming">Type: Upcoming</option>
                  <option value="all">Type: All events</option>
                  <option value="past">Type: Previous events</option>
                </select>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#1a4872]"
                />
              </div>

              <div className="relative h-[56px] w-[190px]">
                <label htmlFor="event-format" className="sr-only">
                  Filter events by format
                </label>
                <select
                  id="event-format"
                  value={format}
                  onChange={(event) => setFormat(event.target.value)}
                  className="h-full w-full appearance-none border border-[#1a4872] bg-white px-[16px] pr-9 text-[16px] text-[#1a4872] outline-none"
                >
                  <option value="all">Format: All</option>
                  <option value="offline">Format: In-person</option>
                  <option value="online">Format: Online</option>
                </select>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#1a4872]"
                />
              </div>

              <button
                type="button"
                aria-pressed={status !== "upcoming"}
                onClick={() =>
                  setStatus((prev) => (prev === "upcoming" ? "all" : "upcoming"))
                }
                className={`inline-flex h-[48px] cursor-pointer items-center justify-center border border-[#1a4872] px-[20px] text-[16px] font-medium transition-colors ${
                  status !== "upcoming"
                    ? "bg-[#1a4872] text-white"
                    : "bg-white text-[#1a4872] hover:bg-[#e6ecf2]"
                }`}
              >
                {status !== "upcoming"
                  ? "Hide previous events"
                  : "Show previous events"}
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-[48px] min-w-[160px] cursor-pointer items-center justify-center border border-[#1a4872] bg-white px-[20px] text-[16px] font-medium text-[#1a4872] transition-colors hover:bg-[#e6ecf2]"
              >
                Clear filters
              </button>
            </div>

            {/* Event List Grouped by Date (4:340) */}
            <div className="mt-[59px]">
              {loading ? (
                <div
                  className="grid min-h-64 place-items-center text-[#1a4872]"
                  role="status"
                >
                  <div className="flex items-center gap-3">
                    <LoaderCircle className="animate-spin" aria-hidden="true" />
                    <span>Loading events…</span>
                  </div>
                </div>
              ) : error ? (
                <div
                  className="rounded-[8px] border border-[#1a4872]/20 bg-[#f5f5f5] p-10 text-center"
                  role="alert"
                >
                  <h2 className="text-2xl font-bold text-[#1a4872]">
                    Events are temporarily unavailable
                  </h2>
                  <p className="mt-2 text-[#151729]">
                    Please try again to load the event schedule.
                  </p>
                  <button
                    type="button"
                    className="mt-5 inline-flex min-h-10 items-center justify-center rounded-[8px] bg-[#1a4872] px-6 text-sm font-semibold text-white hover:bg-[#133859]"
                    onClick={() => {
                      setError(false);
                      setLoading(true);
                      setAttempt(attempt + 1);
                    }}
                  >
                    Try again
                  </button>
                </div>
              ) : groupedEvents.length > 0 ? (
                <div className="flex flex-col gap-[32px]">
                  {groupedEvents.map((group) => (
                    <section
                      key={group.dateKey}
                      aria-label={group.label}
                      className="flex flex-col gap-[32px]"
                    >
                      <div className="w-full">
                        <h2 className="text-[28px] font-bold leading-normal text-[#1a4872] sm:text-[36px]">
                          {group.label}
                        </h2>
                        <hr className="mt-[13px] border-0 border-t border-[#1a4872]/35" />
                      </div>

                      <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2">
                        {group.events.map((event, index) => (
                          <EventGridCard key={event.id} event={event} index={index} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="rounded-[8px] border border-[#1a4872]/20 bg-[#f5f5f5] px-6 py-16 text-center">
                  <h2 className="text-2xl font-bold text-[#1a4872]">
                    {status === "upcoming"
                      ? "No upcoming events found"
                      : "No events found"}
                  </h2>
                  <p className="mt-2 text-[#151729]">
                    {items.length
                      ? status === "upcoming"
                        ? "Previous events are hidden by default. Enable previous events to view past schedules."
                        : "Try another keyword, filter, or calendar date."
                      : "Published events will appear here."}
                  </p>
                  {items.length > 0 && (
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                      {status === "upcoming" && (
                        <button
                          type="button"
                          onClick={() => setStatus("all")}
                          className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-[8px] bg-[#1a4872] px-6 text-sm font-semibold text-white hover:bg-[#133859]"
                        >
                          Show previous events
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-[8px] border border-[#1a4872] bg-white px-6 text-sm font-semibold text-[#1a4872] hover:bg-[#e6ecf2]"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Search + Calendar (4:476) */}
          <div className="flex w-full shrink-0 flex-col items-center gap-[25px] xl:w-[408px] xl:sticky xl:top-24">
            <form
              role="search"
              onSubmit={(event) => event.preventDefault()}
              className="flex h-[34px] w-full max-w-[320px] items-center gap-[8px] rounded-[4px] border border-[#7c8999] bg-white px-[24px] focus-within:border-[#1a4872]"
            >
              <Search
                size={20}
                aria-hidden="true"
                className="shrink-0 text-[#7c8999]"
              />
              <label htmlFor="event-search" className="sr-only">
                Search events
              </label>
              <input
                id="event-search"
                type="search"
                placeholder="Search research events"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[16px] leading-[32px] text-[#151729] outline-none placeholder:text-[#7c8999]"
              />
            </form>

            <EventCalendar
              events={items}
              selectedDateKey={selectedDateKey}
              onSelectDateKey={setSelectedDateKey}
              todayDateKey={todayDateKey}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
