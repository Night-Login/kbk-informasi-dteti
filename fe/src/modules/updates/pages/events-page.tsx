"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import { apiRequest, type WebsiteEvent } from "@/lib/api";
import { ArrowUpRight, CalendarDays, Clock3, LoaderCircle, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

export default function EventsPage() {
  const [items, setItems] = useState<WebsiteEvent[]>([]);
  const [query, setQuery] = useState("");
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
    if (!normalizedQuery) return items;
    return items.filter((item) =>
      [item.title, item.description || "", item.location]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }, [items, query]);

  return (
    <main id="main-content" className="min-h-screen bg-white pb-20 pt-24 text-ink sm:pt-28">
      <div className="page-container">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Events" }]} />

        <header className="max-w-3xl pb-8 pt-7">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-dteti-blue/70">Updates</p>
          <h1 className="mt-2 text-4xl font-bold tracking-[-0.025em] text-dteti-blue sm:text-5xl">Events</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            Seminars, discussions, workshops, and other academic activities managed through the website dashboard.
          </p>
        </header>

        <form className="mb-10 max-w-2xl" role="search" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="event-search">Search events</label>
          <div className="flex min-h-14 items-center gap-3 rounded-xl border border-line px-5 focus-within:border-dteti-blue focus-within:ring-2 focus-within:ring-focus">
            <Search size={20} className="text-muted" aria-hidden="true" />
            <input
              id="event-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search event or location"
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted"
            />
          </div>
        </form>

        {loading ? (
          <div className="grid min-h-64 place-items-center" role="status">
            <div className="flex items-center gap-3 font-semibold text-dteti-blue">
              <LoaderCircle className="animate-spin" aria-hidden="true" /> Loading events…
            </div>
          </div>
        ) : error ? (
          <div className="border border-line bg-surface px-6 py-14 text-center">
            <h2 className="text-xl font-bold text-dteti-blue">Events are temporarily unavailable</h2>
            <p className="mt-2 text-sm text-muted">{error}</p>
          </div>
        ) : visibleItems.length > 0 ? (
          <section aria-label="Events" className="grid gap-6 lg:grid-cols-2">
            {visibleItems.map((event) => {
              const start = new Date(event.starts_at);
              const end = event.ends_at ? new Date(event.ends_at) : null;
              return (
                <article id={event.slug} key={event.id} className="scroll-mt-28 border border-line bg-white p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="grid size-12 flex-none place-items-center bg-dteti-yellow text-dteti-ink">
                      <CalendarDays size={23} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold leading-7 text-dteti-blue">{event.title}</h2>
                      {event.description ? <p className="mt-3 text-sm leading-6 text-muted">{event.description}</p> : null}
                    </div>
                  </div>

                  <dl className="mt-6 grid gap-3 border-t border-line pt-5 text-sm sm:grid-cols-2">
                    <div className="flex gap-2.5">
                      <Clock3 size={18} className="mt-0.5 flex-none text-dteti-blue" aria-hidden="true" />
                      <div>
                        <dt className="sr-only">Date and time</dt>
                        <dd className="font-semibold text-ink">
                          {dateFormatter.format(start)}, {timeFormatter.format(start)} WIB
                          {end ? ` – ${timeFormatter.format(end)} WIB` : ""}
                        </dd>
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <MapPin size={18} className="mt-0.5 flex-none text-dteti-blue" aria-hidden="true" />
                      <div>
                        <dt className="sr-only">Location</dt>
                        <dd className="font-semibold text-ink">{event.location}</dd>
                      </div>
                    </div>
                  </dl>

                  {event.link_url ? (
                    <Link href={event.link_url} className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-dteti-blue hover:underline">
                      Event information <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  ) : null}
                </article>
              );
            })}
          </section>
        ) : (
          <div className="border border-line bg-surface px-6 py-14 text-center">
            <h2 className="text-xl font-bold text-dteti-blue">No events found</h2>
            <p className="mt-2 text-sm text-muted">
              {items.length > 0 ? "Try another keyword." : "Published events will appear here."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
