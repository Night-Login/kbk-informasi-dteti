"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import LecturerCard from "@/components/people/lecturer-card";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  apiRequest,
  getApiAssetUrl,
  lecturerIsAvailable,
  type Lecturer,
  type PaginatedResult,
  type ResearchSummary,
} from "@/lib/api";
import type { PersonLite } from "@/types/person";
import { ChevronLeft, ChevronRight, LoaderCircle, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 12;

function toPerson(lecturer: Lecturer): PersonLite {
  const groups = new Set<string>();
  lecturer.research_tags?.forEach((relation) => {
    if (relation.tag?.cluster?.name) groups.add(relation.tag.cluster.name);
  });

  return {
    id: lecturer.slug,
    sourceId: lecturer.id,
    fullName: lecturer.full_name,
    position: lecturer.academic_title || "Lecturer",
    isSupervisorAvailable: lecturerIsAvailable(lecturer),
    profilePictureUrl: getApiAssetUrl(lecturer.photo_url),
    contact: {
      labName: [...groups].join(", "),
      email: lecturer.email || undefined,
    },
  };
}

export default function PeopleListPage() {
  const [query, setQuery] = useState("");
  const [activeCluster, setActiveCluster] = useState("");
  const [research, setResearch] = useState<ResearchSummary | null>(null);
  const [result, setResult] = useState<PaginatedResult<Lecturer> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const debouncedQuery = useDebouncedValue(query);

  useEffect(() => {
    const controller = new AbortController();
    apiRequest<ResearchSummary>("research", { signal: controller.signal })
      .then(setResearch)
      .catch(() => {
        if (!controller.signal.aborted) setResearch(null);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    apiRequest<PaginatedResult<Lecturer>>("lecturers/paginated", {
      signal: controller.signal,
      query: {
        page,
        limit: PAGE_SIZE,
        search: debouncedQuery,
        cluster_slug: activeCluster,
        is_active: true,
        sort_by: "full_name",
        sort_order: "asc",
      },
    })
      .then((data) => {
        setResult(data);
        setError("");
      })
      .catch((requestError: Error) => {
        if (!controller.signal.aborted) {
          setError(requestError.message);
          setResult(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [activeCluster, debouncedQuery, page, reloadKey]);

  const lecturers = useMemo(
    () => result?.data.map(toPerson) || [],
    [result],
  );
  const clusters = research?.clusters || [];

  function chooseCluster(slug: string) {
    setLoading(true);
    setActiveCluster((current) => (current === slug ? "" : slug));
    setPage(1);
  }

  return (
    <main id="main-content" className="min-h-screen bg-white pb-20 pt-24 sm:pt-28">
      <div className="page-container">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "People" }]} />

        <h1 className="mb-10 mt-6 text-center text-3xl font-bold text-dteti-blue sm:text-4xl">
          People
        </h1>

        {/* Search & Filter Row (Full Width) */}
        <div className="mb-6 flex w-full items-center gap-3">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              size={17}
              aria-hidden="true"
            />
            <input
              id="lecturer-search"
              type="search"
              value={query}
              onChange={(event) => {
                setLoading(true);
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search name, title, or SINTA ID"
              className="min-h-11 w-full border border-line bg-white py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-muted focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </div>

          {/* Filter Modal Trigger Button */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-dteti-ink transition-all hover:border-dteti-blue hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            aria-label="Open filter options"
          >
            <SlidersHorizontal size={16} className="text-dteti-blue" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-dteti-blue text-[11px] font-extrabold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {clusters.length > 0 ? (
          <div className="mb-5 flex flex-wrap gap-3">
            {clusters.map((cluster) => {
              const isActive = activeCluster === cluster.slug;
              return (
                <button
                  key={cluster.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => chooseCluster(cluster.slug)}
                  className={[
                    "min-h-11 border px-4 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
                    isActive
                      ? "border-dteti-blue bg-dteti-yellow text-dteti-ink"
                      : "border-line bg-white text-dteti-ink hover:border-dteti-blue hover:bg-dteti-blue-soft",
                  ].join(" ")}
                >
                  {cluster.name}
                </button>
              );
            })}
          </div>
        ) : null}
        {/* Category Tabs */}
        <div className="mb-4 flex w-full items-center gap-3 overflow-x-auto pb-2">
          <button
            type="button"
            aria-pressed={!activeCategory}
            onClick={() => setActiveCategory("")}
            className={[
              "flex min-h-12 shrink-0 items-center justify-center rounded-lg border px-5 py-3 text-center text-sm font-bold leading-tight text-dteti-ink transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
              !activeCategory
                ? "border-dteti-blue bg-dteti-yellow shadow-[inset_0_-3px_0_var(--dteti-blue)]"
                : "border-dteti-yellow bg-white hover:bg-dteti-yellow/20",
            ].join(" ")}
          >
            All
          </button>
          {categories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => toggleCategory(category)}
                className={[
                  "flex min-h-12 shrink-0 items-center justify-center rounded-lg border px-5 py-3 text-center text-sm font-bold leading-tight text-dteti-ink transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
                  isActive
                    ? "border-dteti-blue bg-dteti-yellow shadow-[inset_0_-3px_0_var(--dteti-blue)]"
                    : "border-dteti-yellow bg-white hover:bg-dteti-yellow/20",
                ].join(" ")}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="sr-only" htmlFor="people-category-filter">
            Filter lecturers by research group
          </label>
          <select
            id="people-category-filter"
            value={activeCluster}
            onChange={(event) => {
              setLoading(true);
              setActiveCluster(event.target.value);
              setPage(1);
            }}
            className="min-h-10 w-full border border-line bg-white px-3 text-sm text-ink focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus sm:w-72"
          >
            <option value="">All research groups</option>
            {clusters.map((cluster) => (
              <option key={cluster.id} value={cluster.slug}>
                {cluster.name}
              </option>
            ))}
          </select>

          <p className="text-sm text-muted" aria-live="polite">
            {loading
              ? "Loading lecturers…"
              : `Showing ${lecturers.length} of ${result?.total || 0} people`}
          </p>
        </div>

        {loading ? (
          <div className="grid min-h-64 place-items-center" role="status">
            <LoaderCircle className="animate-spin text-dteti-blue" aria-hidden="true" />
            <span className="sr-only">Loading lecturers</span>
          </div>
        ) : error ? (
          <div className="border border-line bg-surface px-6 py-14 text-center">
            <h2 className="text-lg font-semibold text-dteti-blue">
              Lecturer data is temporarily unavailable
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted">{error}</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setReloadKey((value) => value + 1);
              }}
              className="mt-5 min-h-11 bg-dteti-blue px-5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            >
              Try again
            </button>
          </div>
        ) : lecturers.length > 0 ? (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-x-6 gap-y-8">
              {lecturers.map((lecturer, index) => (
                <LecturerCard
                  key={lecturer.sourceId || lecturer.id}
                  lecturer={lecturer}
                  priority={index < 4}
                />
              ))}
            </div>

            {(result?.total_pages || 1) > 1 ? (
              <nav
                className="mt-10 flex items-center justify-center gap-4"
                aria-label="Lecturer pagination"
              >
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => {
                    setLoading(true);
                    setPage((value) => Math.max(1, value - 1));
                  }}
                  className="inline-flex min-h-11 items-center gap-2 border border-line px-4 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <ChevronLeft size={17} aria-hidden="true" />
                  Previous
                </button>
                <span className="text-sm text-muted">
                  Page {page} of {result?.total_pages || 1}
                </span>
                <button
                  type="button"
                  disabled={page >= (result?.total_pages || 1)}
                  onClick={() => {
                    setLoading(true);
                    setPage((value) => value + 1);
                  }}
                  className="inline-flex min-h-11 items-center gap-2 border border-line px-4 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Next
                  <ChevronRight size={17} aria-hidden="true" />
                </button>
              </nav>
            ) : null}
          </>
        ) : (
          <div className="border border-line bg-surface px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-dteti-blue">
              No lecturers found
            </h2>
            <p className="mt-2 text-sm text-muted">
              Try another name or clear the selected research group.
            </p>
          </div>
        )}
      </div>

      {/* Filter Modal Component */}
      <PeopleFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={filters}
        onApplyFilters={setFilters}
      />
    </main>
  );
}

