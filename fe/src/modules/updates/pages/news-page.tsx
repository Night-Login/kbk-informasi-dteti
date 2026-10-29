"use client";

import DiscoveryPageHero from "@/components/global/discovery-page-hero";
import { apiRequest, type NewsArticle } from "@/lib/api";
import { NewsCard } from "@/modules/homepage/components/content-cards";
import { previewContent } from "@/modules/homepage/data/preview.data";
import { CalendarDays, LoaderCircle, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const sortOptions = [
  { value: "latest", label: "Latest first" },
  { value: "oldest", label: "Oldest first" },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

export default function NewsPage() {
  const [items, setItems] = useState<NewsArticle[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortValue>("latest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    if (new URLSearchParams(window.location.search).get("preview") === "1") {
      Promise.resolve().then(() => {
        setPreview(true);
        setItems(previewContent.news);
        setError("");
        setLoading(false);
      });
      return () => controller.abort();
    }

    apiRequest<NewsArticle[]>("content/news", {
      query: { limit: 100 },
      signal: controller.signal,
    })
      .then((data) => {
        setItems(data);
        setError("");
      })
      .catch((requestError: Error) => {
        if (!controller.signal.aborted) {
          setError(requestError.message || "Unable to load news articles.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [attempt]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return items
      .filter(
        (item) =>
          !normalizedQuery ||
          [item.title, item.excerpt, item.body || ""]
            .join(" ")
            .toLocaleLowerCase()
            .includes(normalizedQuery),
      )
      .toSorted((first, second) => {
        const difference =
          new Date(second.published_at).getTime() -
          new Date(first.published_at).getTime();
        return sort === "latest" ? difference : -difference;
      });
  }, [items, query, sort]);

  function clearFilters() {
    setQuery("");
    setSort("latest");
  }

  const featuredArticle = visibleItems[0];
  const gridArticles = visibleItems.slice(1);

  return (
    <main
      id="main-content"
      className="discovery-page min-h-screen bg-white text-[#151729]"
    >
      <DiscoveryPageHero title="News" imageSrc="/images/news-hero.png" />

      {preview && (
        <p className="discovery-preview-notice">
          Design preview · Sample content, not official news announcements.{" "}
          <button
            type="button"
            onClick={() => window.location.assign("/news")}
          >
            Exit preview
          </button>
        </p>
      )}

      <section
        aria-label="Filter and search news"
        className="border-b-2 border-[#151729] bg-white"
      >
        <div className="discovery-container flex min-h-16 flex-wrap items-center justify-between gap-4 py-3">
          <div
            className="flex flex-wrap items-center gap-6"
            role="group"
            aria-label="Sort news"
          >
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={sort === option.value}
                onClick={() => setSort(option.value)}
                className={`min-h-11 border-b-2 px-1 text-base font-semibold transition-colors hover:bg-black/5 ${
                  sort === option.value
                    ? "border-[#151729] text-[#151729]"
                    : "border-transparent text-[#4f5054]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-3 sm:flex-initial">
            <form
              role="search"
              onSubmit={(event) => event.preventDefault()}
              className="w-full sm:w-72"
            >
              <label className=" flex h-10 w-full items-center gap-2 rounded border border-[#7c8999] px-4 text-[#7c8999] focus-within:outline-2 focus-within:outline-offset-2">
                <Search size={18} aria-hidden="true" />
                <span className="sr-only">Search latest news</span>
                <input
                  id="news-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search latest news"
                  className="min-w-0 flex-1 bg-transparent text-sm text-[#151729] outline-none placeholder:text-[#7c8999]"
                />
              </label>
            </form>

            <Link
              href={preview ? "/events?preview=1" : "/events"}
              className="inline-flex min-h-10 items-center gap-2 rounded border border-[#151729] bg-white px-4 text-sm font-semibold text-[#151729] transition-colors hover:bg-[#151729] hover:text-white"
            >
              <CalendarDays size={16} aria-hidden="true" />
              <span>View Events</span>
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-label="News articles"
        aria-busy={loading}
        className="discovery-container py-10 sm:py-14"
      >
        <p className="mb-5 text-sm text-[#7c8999]" aria-live="polite">
          {loading
            ? "Loading news…"
            : `${visibleItems.length} ${
                visibleItems.length === 1 ? "news article" : "news articles"
              }`}
        </p>

        {(query || sort !== "latest") && (
          <button
            type="button"
            onClick={clearFilters}
            className="mb-6 min-h-10 rounded border border-[#151729] px-4 text-sm font-medium hover:bg-black/5"
          >
            Clear filters
          </button>
        )}

        {loading ? (
          <div className="grid min-h-64 place-items-center" role="status">
            <div className="flex items-center gap-3">
              <LoaderCircle className="animate-spin" aria-hidden="true" />
              <span>Loading news…</span>
            </div>
          </div>
        ) : error ? (
          <div role="alert" className="bg-[#d9d9d9] p-8 text-center">
            <h2 className="text-xl font-semibold">
              News is temporarily unavailable
            </h2>
            <p className="mt-3 text-sm text-[#4f5054]">{error}</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setError("");
                setAttempt((value) => value + 1);
              }}
              className="mt-5 min-h-11 rounded border border-[#151729] bg-white px-5 text-sm font-semibold transition-colors hover:bg-[#151729] hover:text-white"
            >
              Try again
            </button>
          </div>
        ) : visibleItems.length > 0 ? (
          <div>
            {featuredArticle && (
              <div id={featuredArticle.slug} className="scroll-mt-24">
                <NewsCard
                  article={featuredArticle}
                  featured
                  preview={preview}
                />
              </div>
            )}

            {gridArticles.length > 0 && (
              <div className="discovery-news-grid">
                {gridArticles.map((article) => (
                  <div
                    key={article.id}
                    id={article.slug}
                    className="scroll-mt-24"
                  >
                    <NewsCard article={article} preview={preview} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#d9d9d9] px-6 py-16 text-center">
            <h2 className="text-xl font-semibold">No news found</h2>
            <p className="mt-2 text-sm text-[#4f5054]">
              {items.length > 0
                ? "Try another keyword or clear your filters."
                : "Published news will appear here."}
            </p>
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 min-h-11 rounded border border-[#151729] bg-white px-5 text-sm font-semibold transition-colors hover:bg-[#151729] hover:text-white"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
