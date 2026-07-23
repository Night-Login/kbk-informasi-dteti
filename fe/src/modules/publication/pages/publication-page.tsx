"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import TopicTag from "@/components/global/topic-tag";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  apiRequest,
  getPublicationTags,
  type Lecturer,
  type PaginatedResult,
  type Publication,
  type ResearchTag,
} from "@/lib/api";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LoaderCircle,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 12;
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 25 }, (_, index) => currentYear - index);

export default function PublicationPage() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const [tags, setTags] = useState<ResearchTag[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [result, setResult] = useState<PaginatedResult<Publication> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const debouncedQuery = useDebouncedValue(query);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      apiRequest<ResearchTag[]>("research/tags", {
        signal: controller.signal,
        query: { is_active: true },
      }),
      apiRequest<Lecturer[]>("lecturers", {
        signal: controller.signal,
        query: {
          is_active: true,
          limit: 250,
          sort_by: "full_name",
          sort_order: "asc",
        },
      }),
    ])
      .then(([tagData, lecturerData]) => {
        setTags(tagData);
        setLecturers(lecturerData);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setTags([]);
          setLecturers([]);
        }
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    apiRequest<PaginatedResult<Publication>>("publications/paginated", {
      signal: controller.signal,
      query: {
        page,
        limit: PAGE_SIZE,
        search: debouncedQuery,
        tag_slug: tag,
        lecturer_slug: lecturer,
        year,
        sort_by: "year",
        sort_order: "desc",
      },
    })
      .then((data) => {
        setResult(data);
        setError("");
      })
      .catch((requestError: Error) => {
        if (!controller.signal.aborted) {
          setResult(null);
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [debouncedQuery, lecturer, page, tag, year]);

  const selectedTag = useMemo(
    () => tags.find((item) => item.slug === tag)?.name,
    [tag, tags],
  );
  const selectedLecturer = useMemo(
    () => lecturers.find((item) => item.slug === lecturer)?.full_name,
    [lecturer, lecturers],
  );
  const activeFilters = [
    tag
      ? { key: "tag", label: selectedTag || tag, clear: () => setTag("") }
      : null,
    lecturer
      ? {
          key: "lecturer",
          label: selectedLecturer || lecturer,
          clear: () => setLecturer(""),
        }
      : null,
    year ? { key: "year", label: year, clear: () => setYear("") } : null,
  ].filter((filter): filter is NonNullable<typeof filter> => filter !== null);

  function clearFilters() {
    setLoading(true);
    setQuery("");
    setTag("");
    setLecturer("");
    setYear("");
    setPage(1);
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
            Search publications
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
              onChange={(event) => {
                setLoading(true);
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search title, author, venue, DOI, or abstract"
              className="min-h-16 w-full border border-muted bg-white py-4 pl-14 pr-5 text-lg font-medium text-ink placeholder:text-muted focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus sm:text-xl"
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
              value={tag}
              onChange={(event) => {
                setLoading(true);
                setTag(event.target.value);
                setPage(1);
              }}
              className="min-h-11 border border-line bg-white px-3 text-sm text-ink focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
            >
              <option value="">Research topic</option>
              {tags.map((option) => (
                <option key={option.id} value={option.slug}>
                  {option.name}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="publication-lecturer">
              Lecturer
            </label>
            <select
              id="publication-lecturer"
              value={lecturer}
              onChange={(event) => {
                setLoading(true);
                setLecturer(event.target.value);
                setPage(1);
              }}
              className="min-h-11 max-w-72 border border-line bg-white px-3 text-sm text-ink focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
            >
              <option value="">Lecturer</option>
              {lecturers.map((option) => (
                <option key={option.id} value={option.slug}>
                  {option.full_name}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="publication-year">
              Publication year
            </label>
            <select
              id="publication-year"
              value={year}
              onChange={(event) => {
                setLoading(true);
                setYear(event.target.value);
                setPage(1);
              }}
              className="min-h-11 border border-line bg-white px-3 text-sm text-ink focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
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
              disabled={activeFilters.length === 0 && !query}
              className="min-h-11 bg-dteti-blue-soft px-4 text-sm font-semibold text-dteti-ink transition-colors hover:bg-dteti-blue-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear all
            </button>
          </div>

          {activeFilters.length > 0 ? (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <p className="text-sm text-ink">Active filters:</p>
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    filter.clear();
                    setPage(1);
                  }}
                  className="inline-flex min-h-9 items-center gap-2 border border-dteti-ink/70 bg-dteti-yellow px-3 py-1 text-sm text-dteti-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
                  aria-label={`Remove ${filter.label} filter`}
                >
                  {filter.label}
                  <X size={14} aria-hidden="true" />
                </button>
              ))}
            </div>
          ) : null}

          <p className="mt-5 text-sm text-muted" aria-live="polite">
            {loading
              ? "Loading publications…"
              : `${result?.total || 0} ${result?.total === 1 ? "publication" : "publications"} found`}
          </p>
        </section>

        <section className="mt-10" aria-label="Publication results">
          {loading ? (
            <div className="grid min-h-64 place-items-center" role="status">
              <LoaderCircle className="animate-spin text-dteti-blue" aria-hidden="true" />
              <span className="sr-only">Loading publications</span>
            </div>
          ) : error ? (
            <div className="bg-surface px-6 py-16 text-center">
              <h2 className="text-lg font-semibold text-dteti-blue">
                Publication data is temporarily unavailable
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted">{error}</p>
            </div>
          ) : result && result.data.length > 0 ? (
            <>
              <ol className="border-t border-muted">
                {result.data.map((publication) => {
                  const publicationTags = getPublicationTags(publication);
                  const href =
                    publication.url ||
                    (publication.doi ? `https://doi.org/${publication.doi}` : `#${publication.slug}`);
                  const isExternal = href.startsWith("http");

                  return (
                    <li
                      id={publication.slug}
                      key={publication.id}
                      className="border-b border-muted py-7"
                    >
                      <a
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="inline-flex items-start gap-2 text-lg font-bold text-dteti-blue hover:underline sm:text-xl"
                      >
                        {publication.title}
                        {isExternal ? (
                          <ExternalLink className="mt-1 shrink-0" size={16} aria-hidden="true" />
                        ) : null}
                      </a>
                      <p className="mt-2 text-sm leading-6 text-ink">
                        {[
                          publication.publication_type,
                          publication.venue,
                          publication.year,
                          publication.authors_text,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      {publication.abstract ? (
                        <p className="mt-3 max-w-4xl text-sm leading-6 text-muted">
                          {publication.abstract}
                        </p>
                      ) : null}
                      {publicationTags.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-3">
                          {publicationTags.map((researchTag) => (
                            <TopicTag key={researchTag.id}>{researchTag.name}</TopicTag>
                          ))}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ol>

              {result.total_pages > 1 ? (
                <nav
                  className="mt-10 flex items-center justify-center gap-4"
                  aria-label="Publication pagination"
                >
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => {
                      setLoading(true);
                      setPage((value) => Math.max(1, value - 1));
                    }}
                    className="inline-flex min-h-11 items-center gap-2 border border-line px-4 text-sm font-semibold disabled:opacity-45"
                  >
                    <ChevronLeft size={17} aria-hidden="true" />
                    Previous
                  </button>
                  <span className="text-sm text-muted">
                    Page {page} of {result.total_pages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= result.total_pages}
                    onClick={() => {
                      setLoading(true);
                      setPage((value) => value + 1);
                    }}
                    className="inline-flex min-h-11 items-center gap-2 border border-line px-4 text-sm font-semibold disabled:opacity-45"
                  >
                    Next
                    <ChevronRight size={17} aria-hidden="true" />
                  </button>
                </nav>
              ) : null}
            </>
          ) : (
            <div className="bg-surface px-6 py-16 text-center">
              <h2 className="text-lg font-semibold text-dteti-blue">
                No publications found
              </h2>
              <p className="mt-2 text-sm text-muted">
                Try another search or remove one of the active filters.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
