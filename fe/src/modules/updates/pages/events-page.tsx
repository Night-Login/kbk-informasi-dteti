"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import { DropdownSelect } from "@/components/global/dropdown-select";
import { apiRequest, getApiAssetUrl, type WebsiteEvent } from "@/lib/api";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  LoaderCircle,
  MapPin,
  Newspaper,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const statusOptions = [
  { value: "all", label: "All events" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past events" },
];

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Jakarta",
});

const monthFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
});

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
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    apiRequest<WebsiteEvent[]>("content/events", {
      query: { limit: 100 },
      signal: controller.signal,
    })
      .then(setItems)
      .catch((requestError: Error) => {
        if (!controller.signal.aborted) setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return items.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        [item.title, item.description || "", item.location]
          .join(" ")
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      const endTime = new Date(item.ends_at || item.starts_at).getTime();
      const matchesStatus =
        status === "all" ||
        (status === "upcoming" && endTime >= referenceTime) ||
        (status === "past" && endTime < referenceTime);
      return matchesQuery && matchesStatus;
    });
  }, [items, query, referenceTime, status]);

  return (
    <main
      id="main-content"
      className="min-h-screen bg-white pb-20 pt-24 text-ink sm:pt-28"
    >
      <div className="page-container">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Events" }]}
        />

        <header className="mx-auto max-w-3xl pb-8 pt-7 text-center">
          <h1 className="text-4xl font-bold tracking-[-0.025em] text-dteti-blue sm:text-5xl">
            Events
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted"></p>
        </header>

        <form role="search" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="event-search">
            Search events
          </label>
          <div className="flex min-h-14 items-center gap-3 rounded-xl border border-line px-5 focus-within:border-dteti-blue focus-within:ring-2 focus-within:ring-focus sm:min-h-16 sm:px-7">
            <Search size={20} className="text-muted" aria-hidden="true" />
            <input
              id="event-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search events or locations"
              className="min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-muted"
            />
          </div>
        </form>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <DropdownSelect
            value={status}
            onChange={setStatus}
            options={statusOptions}
            placeholder="Filter events"
            className="w-44"
          />
          <Link
            href="/news"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-xs font-bold text-dteti-blue hover:border-dteti-blue hover:bg-dteti-blue-soft"
          >
            <Newspaper size={16} aria-hidden="true" /> View news
          </Link>
        </div>

        {loading ? (
          <div className="grid min-h-64 place-items-center" role="status">
            <div className="flex items-center gap-3 font-semibold text-dteti-blue">
              <LoaderCircle className="animate-spin" aria-hidden="true" />{" "}
              Loading events…
            </div>
          </div>
        ) : error ? (
          <div className="mt-10 border border-line bg-surface px-6 py-14 text-center">
            <h2 className="text-xl font-bold text-dteti-blue">
              Events are temporarily unavailable
            </h2>
            <p className="mt-2 text-sm text-muted">{error}</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1.3fr)_minmax(22rem,0.7fr)] xl:items-start">
            {visibleItems.length > 0 ? (
              <section
                aria-label="Events"
                className="grid gap-6 sm:grid-cols-2"
              >
                {visibleItems.map((event, index) => {
                  const start = new Date(event.starts_at);
                  const end = event.ends_at ? new Date(event.ends_at) : null;
                  const image = getApiAssetUrl(
                    event.media?.file_url || event.image_url,
                  );
                  return (
                    <article
                      id={event.slug}
                      key={event.id}
                      className="flex scroll-mt-28 flex-col overflow-hidden rounded-xl border border-line bg-white"
                    >
                      {image ? (
                        <div className="relative h-52 bg-surface-strong">
                          <Image
                            src={image}
                            alt={event.media?.alt_text || event.title}
                            fill
                            priority={index < 2}
                            sizes="(min-width: 1280px) 28vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover"
                            unoptimized={
                              image.startsWith("http") ||
                              image.startsWith("/uploads/")
                            }
                          />
                        </div>
                      ) : null}
                      <div className="flex flex-1 flex-col p-6">
                        <time
                          dateTime={event.starts_at}
                          className="text-xs font-bold uppercase tracking-wider text-dteti-blue"
                        >
                          {dateFormatter.format(start)}
                        </time>
                        <h2 className="mt-3 text-xl font-bold leading-7 text-dteti-ink">
                          {event.title}
                        </h2>
                        {event.description ? (
                          <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted">
                            {event.description}
                          </p>
                        ) : null}
                        <dl className="mt-5 grid gap-3 border-t border-line pt-4 text-xs">
                          <div className="flex gap-2.5">
                            <Clock3
                              size={16}
                              className="mt-0.5 flex-none text-dteti-blue"
                              aria-hidden="true"
                            />
                            <div>
                              <dt className="sr-only">Time</dt>
                              <dd className="font-semibold text-ink">
                                {timeFormatter.format(start)} WIB
                                {end
                                  ? ` – ${timeFormatter.format(end)} WIB`
                                  : ""}
                              </dd>
                            </div>
                          </div>
                          <div className="flex gap-2.5">
                            <MapPin
                              size={16}
                              className="mt-0.5 flex-none text-dteti-blue"
                              aria-hidden="true"
                            />
                            <div>
                              <dt className="sr-only">Location</dt>
                              <dd className="font-semibold text-ink">
                                {event.location}
                              </dd>
                            </div>
                          </div>
                        </dl>
                        {event.link_url ? (
                          <Link
                            href={event.link_url}
                            className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-bold text-dteti-blue hover:underline"
                          >
                            Event information{" "}
                            <ArrowUpRight size={16} aria-hidden="true" />
                          </Link>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </section>
            ) : (
              <div className="border border-line bg-surface px-6 py-14 text-center">
                <h2 className="text-xl font-bold text-dteti-blue">
                  No events found
                </h2>
                <p className="mt-2 text-sm text-muted">
                  {items.length > 0
                    ? "Try another keyword or event status."
                    : "Published events will appear here."}
                </p>
              </div>
            )}
            <EventCalendar events={visibleItems} />
          </div>
        )}
      </div>
    </main>
  );
}
