"use client";

import { ArrowUpRight, LoaderCircle, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Breadcrumbs from "@/components/global/breadcrumbs";
import { apiRequest, type AcademicContentItem } from "@/lib/api";

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<AcademicContentItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    apiRequest<AcademicContentItem[]>("content/scholarships", {
      query: { limit: 100, sort_by: "sort_order", sort_order: "asc" },
      signal: controller.signal,
    })
      .then((items) => {
        setScholarships(items);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(requestError instanceof Error ? requestError.message : "Scholarships could not be loaded.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const visibleScholarships = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return scholarships;

    return scholarships.filter((scholarship) =>
      [scholarship.title, scholarship.overview, scholarship.information]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery)),
    );
  }, [query, scholarships]);

  return (
    <main id="main-content" className="min-h-screen bg-white pt-16 text-ink sm:pt-20">
      <div className="page-container py-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Academic", href: "/academic" },
            { label: "Scholarships" },
          ]}
        />
      </div>

      <section className="page-container pb-20 pt-2 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.025em] text-dteti-blue">
            Scholarships
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted">
            Browse funding opportunities for prospective and current master&apos;s and doctoral students.
            Each listing links to its official information or application page.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-6xl">
          <label className="relative block" htmlFor="scholarship-search">
            <span className="sr-only">Search scholarships</span>
            <Search
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-dteti-blue"
              size={20}
              aria-hidden="true"
            />
            <input
              id="scholarship-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search scholarship opportunities"
              className="min-h-14 w-full rounded-xl border border-line bg-white py-3 pl-14 pr-5 text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-dteti-blue focus:ring-2 focus:ring-dteti-blue-soft"
            />
          </label>

          {loading ? (
            <div className="grid min-h-64 place-items-center" role="status">
              <div className="flex items-center gap-3 font-semibold text-dteti-blue">
                <LoaderCircle className="animate-spin" aria-hidden="true" /> Loading scholarships…
              </div>
            </div>
          ) : error ? (
            <div className="mt-10 border-y border-line bg-surface px-6 py-14 text-center">
              <h2 className="text-xl font-bold text-dteti-blue">Scholarships are temporarily unavailable</h2>
              <p className="mt-2 text-sm text-muted">{error}</p>
            </div>
          ) : visibleScholarships.length > 0 ? (
            <section aria-label="Scholarship opportunities" className="mt-10 border-y border-line">
              {visibleScholarships.map((scholarship) => (
                <article
                  key={scholarship.id}
                  className="grid gap-6 border-b border-line px-1 py-8 last:border-b-0 md:grid-cols-[minmax(0,1fr)_15rem] md:items-center md:gap-12"
                >
                  <div>
                    <h2 className="text-xl font-extrabold leading-8 text-dteti-blue-deep sm:text-2xl">
                      {scholarship.title}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-ink">{scholarship.overview}</p>
                    {scholarship.information ? (
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{scholarship.information}</p>
                    ) : null}
                  </div>
                  <Link
                    href={scholarship.link_url}
                    target={/^https?:\/\//.test(scholarship.link_url) ? "_blank" : undefined}
                    rel={/^https?:\/\//.test(scholarship.link_url) ? "noopener noreferrer" : undefined}
                    className="inline-flex min-h-11 items-center justify-between gap-3 rounded-lg bg-dteti-yellow px-5 text-sm font-extrabold text-dteti-ink transition-colors hover:bg-dteti-yellow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dteti-blue focus-visible:ring-offset-2"
                  >
                    View official information
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </section>
          ) : (
            <div className="mt-10 border-y border-line bg-surface px-6 py-14 text-center">
              <h2 className="text-xl font-bold text-dteti-blue">
                {scholarships.length === 0 ? "No scholarships are published yet" : "No scholarships match your search"}
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">
                {scholarships.length === 0
                  ? "Please check again later for new funding opportunities."
                  : "Try a broader keyword or clear the search field."}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
