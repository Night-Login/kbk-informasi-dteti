"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import { DropdownSelect } from "@/components/global/dropdown-select";
import { apiRequest, getApiAssetUrl, type NewsArticle } from "@/lib/api";
import { ArrowRight, CalendarDays, LoaderCircle, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const sortOptions = [
  { value: "latest", label: "Latest first" },
  { value: "oldest", label: "Oldest first" },
];

function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

export default function NewsPage() {
  const [items, setItems] = useState<NewsArticle[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    apiRequest<NewsArticle[]>("content/news", {
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
    return items
      .filter((item) =>
        !normalizedQuery ||
        [item.title, item.excerpt, item.body || ""]
          .join(" ")
          .toLocaleLowerCase()
          .includes(normalizedQuery),
      )
      .toSorted((first, second) => {
        const difference = new Date(second.published_at).getTime() - new Date(first.published_at).getTime();
        return sort === "latest" ? difference : -difference;
      });
  }, [items, query, sort]);

  return (
    <main id="main-content" className="min-h-screen bg-white pb-20 pt-24 text-ink sm:pt-28">
      <div className="page-container">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Update", href: "/news" },
            { label: "News" },
          ]}
        />

        <header className="mx-auto max-w-3xl pb-8 pt-7 text-center">
          <h1 className="text-4xl font-bold tracking-[-0.025em] text-dteti-blue sm:text-5xl">
            News
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted">
            Research highlights, achievements, and announcements from the Information
            Engineering Research Group.
          </p>
        </header>

        <form role="search" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="news-search">Search latest news</label>
          <div className="flex min-h-14 items-center gap-3 rounded-xl border border-line px-5 focus-within:border-dteti-blue focus-within:ring-2 focus-within:ring-focus sm:min-h-16 sm:px-7">
            <Search size={20} className="text-muted" aria-hidden="true" />
            <input
              id="news-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search latest news"
              className="min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-muted"
            />
          </div>
        </form>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <DropdownSelect
            value={sort}
            onChange={setSort}
            options={sortOptions}
            placeholder="Sort news"
            className="w-44"
          />
          <Link
            href="/events"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-xs font-bold text-dteti-blue hover:border-dteti-blue hover:bg-dteti-blue-soft"
          >
            <CalendarDays size={16} aria-hidden="true" /> View events
          </Link>
        </div>

        {loading ? (
          <div className="grid min-h-64 place-items-center" role="status">
            <div className="flex items-center gap-3 font-semibold text-dteti-blue">
              <LoaderCircle className="animate-spin" aria-hidden="true" /> Loading news…
            </div>
          </div>
        ) : error ? (
          <div className="mt-10 border border-line bg-surface px-6 py-14 text-center">
            <h2 className="text-xl font-bold text-dteti-blue">News is temporarily unavailable</h2>
            <p className="mt-2 text-sm text-muted">{error}</p>
          </div>
        ) : visibleItems.length > 0 ? (
          <section aria-label="News articles" className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item, index) => {
              const image = getApiAssetUrl(item.media?.file_url || item.image_url);
              return (
                <article
                  id={item.slug}
                  key={item.id}
                  className="scroll-mt-28 transition-transform duration-200 hover:-translate-y-1"
                >
                  <Link
                    href={`/news/${encodeURIComponent(item.slug)}`}
                    aria-label={`Read ${item.title}`}
                    className="brand-gradient group flex h-full flex-col overflow-hidden rounded-xl border border-dteti-blue-deep/20 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dteti-yellow focus-visible:ring-offset-2"
                  >
                    {image ? (
                      <div className="relative h-56 bg-dteti-blue-deep">
                      <Image
                        src={image}
                        alt={item.media?.alt_text || item.title}
                        fill
                        priority={index < 2}
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                        unoptimized={image.startsWith("http") || image.startsWith("/uploads/")}
                      />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-6">
                      <time dateTime={item.published_at} className="text-xs font-bold uppercase tracking-wider text-white/75">
                        {formatPublishedDate(item.published_at)}
                      </time>
                      <h2 className="mt-3 text-xl font-bold leading-7 text-white group-hover:underline">
                        {item.title}
                      </h2>
                      <p className="mt-3 line-clamp-5 text-sm leading-6 text-white/90">{item.excerpt}</p>
                      <span className="mt-6 inline-flex items-center gap-1.5 self-start text-sm font-bold text-dteti-yellow group-hover:underline">
                        Read article <ArrowRight size={16} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </section>
        ) : (
          <div className="mt-10 border border-line bg-surface px-6 py-14 text-center">
            <h2 className="text-xl font-bold text-dteti-blue">No news found</h2>
            <p className="mt-2 text-sm text-muted">
              {items.length > 0 ? "Try another keyword." : "Published news will appear here."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
