"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import LecturerCard from "@/modules/people/components/lecturer-card";
import PeopleFilterModal, {
  defaultPeopleFilterValues,
  countActiveFilters,
  type PeopleFilterValues,
} from "@/modules/people/components/people-filter-modal";
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
import { ChevronLeft, ChevronRight, LoaderCircle, Search, SlidersHorizontal } from "lucide-react";
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

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<PeopleFilterValues>(defaultPeopleFilterValues);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

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
    const tagSlugParam =
      filters.tagSlug && filters.tagSlug !== "all" ? filters.tagSlug : undefined;

    apiRequest<PaginatedResult<Lecturer>>("lecturers/paginated", {
      signal: controller.signal,
      query: {
        page,
        limit: PAGE_SIZE,
        search: debouncedQuery,
        cluster_slug: activeCluster,
        tag_slug: tagSlugParam,
        is_active: filters.isActive === "inactive" ? false : true,
        sort_by: filters.sortBy === "name" ? "full_name" : filters.sortBy,
        sort_order: filters.sortOrder,
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
  }, [activeCluster, debouncedQuery, filters, page, reloadKey]);

  const lecturers = useMemo(() => {
    let list = result?.data.map(toPerson) || [];
    if (filters.supervisionStatus === "available") {
      list = list.filter((p) => p.isSupervisorAvailable);
    } else if (filters.supervisionStatus === "unavailable") {
      list = list.filter((p) => !p.isSupervisorAvailable);
    }
    return list;
  }, [result, filters.supervisionStatus]);

  const clusters = research?.clusters || [];

  const availableTags = useMemo(() => {
    if (!research?.clusters) return undefined;
    const tags: { label: string; value: string }[] = [{ label: "All Topics", value: "all" }];
    research.clusters.forEach((cluster) => {
      cluster.tags?.forEach((tag) => {
        tags.push({ label: `${cluster.name} - ${tag.name}`, value: tag.slug });
      });
    });
    return tags;
  }, [research]);

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

        {/* Search & Filter Row */}
        <div className="mb-6 flex w-full items-center gap-3">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
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
              className="min-h-11 w-full rounded-full border border-line bg-white py-2.5 pl-11 pr-4 text-sm text-ink placeholder:text-muted focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </div>

          {/* Filter Modal Trigger Button */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line bg-white px-5 py-2 text-xs font-bold text-dteti-ink transition-all hover:border-dteti-blue hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
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

        {/* Category / Cluster Tabs */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-pressed={!activeCluster}
            onClick={() => {
              setLoading(true);
              setActiveCluster("");
              setPage(1);
            }}
            className={[
              "flex min-h-11 items-center justify-center rounded-xl border px-5 py-2 text-center text-sm font-bold leading-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
              !activeCluster
                ? "border-dteti-blue bg-dteti-yellow text-dteti-ink shadow-[inset_0_-3px_0_var(--dteti-blue)]"
                : "border-dteti-yellow bg-white text-dteti-ink hover:bg-dteti-yellow/10",
            ].join(" ")}
          >
            All
          </button>
          {clusters.map((cluster) => {
            const isActive = activeCluster === cluster.slug;
            return (
              <button
                key={cluster.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => chooseCluster(cluster.slug)}
                className={[
                  "flex min-h-11 items-center justify-center rounded-xl border px-5 py-2 text-center text-sm font-bold leading-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                  isActive
                    ? "border-dteti-blue bg-dteti-yellow text-dteti-ink shadow-[inset_0_-3px_0_var(--dteti-blue)]"
                    : "border-dteti-yellow bg-white text-dteti-ink hover:bg-dteti-yellow/10",
                ].join(" ")}
              >
                {cluster.name}
              </button>
            );
          })}
        </div>

        {/* Showing Count Text */}
        <p className="mb-6 text-sm text-muted" aria-live="polite">
          {loading
            ? "Loading lecturers…"
            : `Showing ${result?.total ?? lecturers.length} people`}
        </p>

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
        onApplyFilters={(newFilters) => {
          setLoading(true);
          setFilters(newFilters);
          setPage(1);
        }}
        availableTags={availableTags}
      />
    </main>
  );
}

