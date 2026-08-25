"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import { DropdownSelect } from "@/components/global/dropdown-select";
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
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 12;
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 25 }, (_, index) => currentYear - index);

function ExpandableText({ text, maxLength = 400 }: { text: string; maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text || text.length <= maxLength) {
    return <p className="mt-3 max-w-4xl text-sm leading-6 text-muted">{text}</p>;
  }

  const truncatedText = text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";

  return (
    <p className="mt-3 max-w-4xl text-sm leading-6 text-muted">
      {isExpanded ? text : truncatedText}{" "}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="font-semibold text-dteti-blue hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded"
        aria-expanded={isExpanded}
      >
        {isExpanded ? "Read less" : "Read more"}
      </button>
    </p>
  );
}

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
  const debouncedQuery = useDebouncedValue(query, 300);

  const tagOptions = useMemo(
    () => tags.map((option) => ({ label: option.name, value: option.slug })),
    [tags],
  );

  const lecturerOptions = useMemo(
    () =>
      lecturers.map((option) => ({
        label: option.full_name,
        value: option.slug,
      })),
    [lecturers],
  );

  const yearOptions = useMemo(
    () => years.map((option) => ({ label: String(option), value: String(option) })),
    [],
  );

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

  const hasActiveFilters = activeFilters.length > 0 || query.trim() !== "";

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

        {/* Search & Filter Row */}
        <div className="mb-6 flex w-full flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search Input Bar (matching /people) */}
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              size={17}
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
              className="min-h-11 w-full rounded-xl border border-line bg-white py-2.5 pl-11 pr-4 text-sm text-ink placeholder:text-muted focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </div>

          {/* Filter Bar (Research topic, Lecturer, Year, Clear) */}
          <div className="flex flex-wrap items-center gap-3">
            <DropdownSelect
              id="publication-topic"
              value={tag}
              onChange={(val) => {
                setLoading(true);
                setTag(val);
                setPage(1);
              }}
              options={tagOptions}
              placeholder="Research topic"
              searchable
              searchPlaceholder="Search topic..."
              className="w-44 sm:w-48"
            />

            <DropdownSelect
              id="publication-lecturer"
              value={lecturer}
              onChange={(val) => {
                setLoading(true);
                setLecturer(val);
                setPage(1);
              }}
              options={lecturerOptions}
              placeholder="Lecturer"
              searchable
              searchPlaceholder="Search lecturer..."
              className="w-48 sm:w-56"
            />

            <DropdownSelect
              id="publication-year"
              value={year}
              onChange={(val) => {
                setLoading(true);
                setYear(val);
                setPage(1);
              }}
              options={yearOptions}
              placeholder="Year"
              searchable
              searchPlaceholder="Search year..."
              align="right"
              className="w-28 sm:w-32"
            />

            <button
              type="button"
              disabled={!hasActiveFilters}
              onClick={clearFilters}
              className={[
                "flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                hasActiveFilters
                  ? "border-dteti-blue bg-dteti-blue text-white hover:bg-dteti-blue-deep shadow-xs cursor-pointer"
                  : "border-line bg-surface/50 text-muted opacity-40 cursor-not-allowed select-none",
              ].join(" ")}
            >
              Clear all
            </button>
          </div>
        </div>

        <p className="mt-5 text-sm text-muted" aria-live="polite">
          {loading
            ? "Loading publications…"
            : `${result?.total || 0} ${result?.total === 1 ? "publication" : "publications"} found`}
        </p>

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
                      key={publication.doi}
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
                        <ExpandableText text={publication.abstract} maxLength={200} />
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
