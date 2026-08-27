"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import { apiRequest, getApiAssetUrl, type NewsArticle } from "@/lib/api";
import { ArrowUpRight, LoaderCircle, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
    if (!normalizedQuery) return items;
    return items.filter((item) =>
      [item.title, item.excerpt, item.body || ""]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }, [items, query]);

  return (
    <main id="main-content" className="min-h-screen bg-white pb-20 pt-24 text-ink sm:pt-28">
      <div className="page-container">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "News" }]} />

        <header className="max-w-3xl pb-8 pt-7">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-dteti-blue/70">
            Updates
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-[-0.025em] text-dteti-blue sm:text-5xl">
            News
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            Research highlights, achievements, and announcements from the Information
            Engineering Research Group.
          </p>
        </header>

        <form className="mb-10 max-w-2xl" role="search" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="news-search">Search news</label>
          <div className="flex min-h-14 items-center gap-3 rounded-xl border border-line px-5 focus-within:border-dteti-blue focus-within:ring-2 focus-within:ring-focus">
            <Search size={20} className="text-muted" aria-hidden="true" />
            <input
              id="news-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search news"
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted"
            />
          </div>
        </form>

        {loading ? (
          <div className="grid min-h-64 place-items-center" role="status">
            <div className="flex items-center gap-3 font-semibold text-dteti-blue">
              <LoaderCircle className="animate-spin" aria-hidden="true" /> Loading news…
            </div>
          </div>
        ) : error ? (
          <div className="border border-line bg-surface px-6 py-14 text-center">
            <h2 className="text-xl font-bold text-dteti-blue">News is temporarily unavailable</h2>
            <p className="mt-2 text-sm text-muted">{error}</p>
          </div>
        ) : visibleItems.length > 0 ? (
          <section aria-label="News articles" className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => {
              const image = getApiAssetUrl(item.media?.file_url || item.image_url);
              const href = item.link_url || `#${item.slug}`;
              return (
                <article
                  id={item.slug}
                  key={item.id}
                  className="scroll-mt-28 overflow-hidden rounded-xl border border-line bg-white transition-colors hover:border-dteti-blue/45"
                >
                  {image ? (
                    <div className="relative h-52 bg-surface-strong">
                      <Image
                        src={image}
                        alt={item.media?.alt_text || item.title}
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                        unoptimized={image.startsWith("http") || image.startsWith("/uploads/")}
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <time dateTime={item.published_at} className="text-xs font-bold uppercase tracking-wider text-muted">
                      {formatPublishedDate(item.published_at)}
                    </time>
                    <h2 className="mt-3 text-xl font-bold leading-7 text-dteti-blue">
                      <Link href={href} className="hover:underline">
                        {item.title}
                      </Link>
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-muted">{item.excerpt}</p>
                    {item.link_url ? (
                      <Link href={item.link_url} className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-dteti-blue hover:underline">
                        Read more <ArrowUpRight size={16} aria-hidden="true" />
                      </Link>
                    ) : item.body ? (
                      <p className="mt-5 whitespace-pre-line border-t border-line pt-5 text-sm leading-6 text-ink">
                        {item.body}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <div className="border border-line bg-surface px-6 py-14 text-center">
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
