"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import TopicTag from "@/components/global/topic-tag";
import { publicationData } from "@/modules/publication/data/publication.data";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

const topics = Array.from(new Set(publicationData.flatMap((item) => item.tags)));
const years = Array.from(
  new Set(publicationData.map((item) => item.date.match(/\d{4}/)?.[0] ?? "")),
).filter(Boolean);
const lecturers = Array.from(
  new Set(
    publicationData.flatMap((item) =>
      item.authors
        .split(",")
        .map((author) => author.trim())
        .filter(Boolean),
    ),
  ),
);

export default function PublicationPage() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("Artificial Intelligence");
  const [lecturer, setLecturer] = useState("");
  const [year, setYear] = useState("2026");

  const visiblePublications = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return publicationData.filter((publication) => {
      const matchesQuery = publication.title
        .toLocaleLowerCase()
        .includes(normalizedQuery);
      const matchesTopic = !topic || publication.tags.includes(topic);
      const matchesLecturer =
        !lecturer || publication.authors.includes(lecturer);
      const matchesYear = !year || publication.date.includes(year);

      return matchesQuery && matchesTopic && matchesLecturer && matchesYear;
    });
  }, [lecturer, query, topic, year]);

  const activeFilters = [
    topic ? { key: "topic", label: topic, clear: () => setTopic("") } : null,
    lecturer
      ? { key: "lecturer", label: lecturer, clear: () => setLecturer("") }
      : null,
    year ? { key: "year", label: year, clear: () => setYear("") } : null,
  ].filter((filter): filter is NonNullable<typeof filter> => filter !== null);

  function clearFilters() {
    setQuery("");
    setTopic("");
    setLecturer("");
    setYear("");
  }

  return (
    <main id="main-content" className="min-h-screen bg-white pb-20 pt-24 sm:pt-28">
      <div className="page-container">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Publication" }]}
        />

        <h1 className="mb-8 mt-6 text-center text-3xl font-bold text-dteti-blue sm:text-4xl">
          Publications
        </h1>

        <div className="mx-auto max-w-4xl">
          <label htmlFor="publication-search" className="sr-only">
            Search publication by title
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted"
              size={22}
              aria-hidden="true"
            />
            <input
              id="publication-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search publication by title"
              className="min-h-16 w-full rounded-xl border border-muted bg-white py-4 pl-14 pr-5 text-lg font-medium text-ink placeholder:text-muted focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus sm:text-xl"
            />
          </div>
        </div>

        <section className="mt-10" aria-label="Publication filters">
          <div className="flex flex-wrap items-center gap-3">
            <label className="sr-only" htmlFor="publication-topic">
              Research topic
            </label>
            <select
              id="publication-topic"
              value=""
              onChange={(event) => setTopic(event.target.value)}
              className="min-h-10 border border-line bg-white px-3 text-sm text-ink focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
            >
              <option value="">Research Topic</option>
              {topics.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="publication-lecturer">
              Lecturer
            </label>
            <select
              id="publication-lecturer"
              value=""
              onChange={(event) => setLecturer(event.target.value)}
              className="min-h-10 border border-line bg-white px-3 text-sm text-ink focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
            >
              <option value="">Lecturer</option>
              {lecturers.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="publication-year">
              Publication year
            </label>
            <select
              id="publication-year"
              value=""
              onChange={(event) => setYear(event.target.value)}
              className="min-h-10 border border-line bg-white px-3 text-sm text-ink focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
            >
              <option value="">Year</option>
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={clearFilters}
              disabled={activeFilters.length === 0}
              className="min-h-10 bg-dteti-blue-soft px-4 text-sm font-semibold text-dteti-ink transition-colors hover:bg-dteti-blue-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear All
            </button>
          </div>

          <div className="mt-6">
            <p className="text-sm text-ink">Active filter:</p>
            {activeFilters.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-3">
                {activeFilters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={filter.clear}
                    className="inline-flex min-h-9 items-center gap-2 border border-dteti-ink/70 bg-dteti-yellow px-3 py-1 text-sm text-dteti-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
                    aria-label={`Remove ${filter.label} filter`}
                  >
                    {filter.label}
                    <X size={14} aria-hidden="true" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted">No active filters</p>
            )}
          </div>

          <p className="mt-5 text-sm text-muted" aria-live="polite">
            Showing {visiblePublications.length}{" "}
            {visiblePublications.length === 1 ? "Publication" : "Publications"}
          </p>
        </section>

        <section className="mt-10" aria-label="Publication results">
          {visiblePublications.length > 0 ? (
            <ol className="border-t border-muted">
              {visiblePublications.map((publication, index) => (
                <li
                  id={`publication-${index + 1}`}
                  key={publication.title}
                  className="border-b border-muted py-7"
                >
                  <a
                    href={`#publication-${index + 1}`}
                    className="text-lg font-bold text-dteti-blue hover:underline sm:text-xl"
                  >
                    {publication.title}
                  </a>
                  <p className="mt-1 text-sm text-ink">
                    {publication.type} &bull; {publication.date} &bull; {publication.authors}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {publication.tags.map((tag) => (
                      <TopicTag key={tag}>{tag}</TopicTag>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="border border-line bg-surface px-6 py-16 text-center">
              <h2 className="text-lg font-semibold text-dteti-blue">
                No publications found
              </h2>
              <p className="mt-2 text-sm text-muted">
                Try another title or remove one of the active filters.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
