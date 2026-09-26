"use client";

import LecturerCard from "@/modules/people/components/lecturer-card";
import PeopleFilterPanel from "@/modules/people/components/people-filter-panel";
import PeopleHero from "@/modules/people/components/people-hero";
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
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 16;

function toPerson(lecturer: Lecturer): PersonLite {
  const specialties = new Set<string>();
  lecturer.research_tags?.forEach((relation) => {
    if (relation.tag?.name) specialties.add(relation.tag.name);
  });

  return {
    id: lecturer.slug,
    sourceId: lecturer.id,
    fullName: lecturer.full_name,
    position: lecturer.academic_title || "Lecturer",
    isSupervisorAvailable: lecturerIsAvailable(lecturer),
    profilePictureUrl: getApiAssetUrl(lecturer.photo_url),
    contact: {
      labName: [...specialties].slice(0, 2).join(", "),
      email: lecturer.email || undefined,
    },
  };
}

export default function PeopleListPage() {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
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
        tag_slug: selectedTag || undefined,
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
  }, [debouncedQuery, page, reloadKey, selectedTag]);

  const lecturers = useMemo(() => result?.data.map(toPerson) || [], [result]);

  function updateQuery(value: string) {
    setLoading(true);
    setQuery(value);
    setPage(1);
  }

  function updateTag(value: string) {
    setLoading(true);
    setSelectedTag(value);
    setPage(1);
  }

  return (
    <main id="main-content" className="min-h-screen bg-white text-[#151729]">
      <PeopleHero />

      <PeopleFilterPanel
        clusters={research?.clusters || []}
        query={query}
        selectedTag={selectedTag}
        onQueryChange={updateQuery}
        onTagChange={updateTag}
      />

      <section className="px-5 py-10 sm:px-[3%] sm:py-14" aria-label="People directory">
        <p className="mb-6 text-sm text-[#7c8999]" aria-live="polite">
          {loading ? "Loading people…" : `Showing ${result?.total ?? lecturers.length} people`}
        </p>

        {loading ? (
          <div className="grid min-h-64 place-items-center" role="status">
            <div className="flex items-center gap-3">
              <LoaderCircle className="animate-spin" aria-hidden="true" />
              <span>Loading people…</span>
            </div>
          </div>
        ) : error ? (
          <div className="border border-[#aeb5bd] px-6 py-14 text-center">
            <h2 className="text-xl font-semibold">People are temporarily unavailable</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[#7c8999]">{error}</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setReloadKey((value) => value + 1);
              }}
              className="mt-5 min-h-11 border border-[#151729] px-6 text-sm font-semibold transition-colors hover:bg-[#151729] hover:text-white"
            >
              Try again
            </button>
          </div>
        ) : lecturers.length ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {lecturers.map((lecturer, index) => (
                <LecturerCard
                  key={lecturer.sourceId || lecturer.id}
                  lecturer={lecturer}
                  priority={index < 4}
                />
              ))}
            </div>

            {(result?.total_pages || 1) > 1 ? (
              <nav className="mt-12 flex items-center justify-center gap-4" aria-label="People pagination">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => {
                    setLoading(true);
                    setPage((value) => Math.max(1, value - 1));
                  }}
                  className="inline-flex min-h-11 items-center gap-2 border border-[#151729] px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} aria-hidden="true" /> Previous
                </button>
                <span className="text-sm">Page {page} of {result?.total_pages || 1}</span>
                <button
                  type="button"
                  disabled={page >= (result?.total_pages || 1)}
                  onClick={() => {
                    setLoading(true);
                    setPage((value) => value + 1);
                  }}
                  className="inline-flex min-h-11 items-center gap-2 border border-[#151729] px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ChevronRight size={17} aria-hidden="true" />
                </button>
              </nav>
            ) : null}
          </>
        ) : (
          <div className="border border-[#aeb5bd] px-6 py-16 text-center">
            <h2 className="text-xl font-semibold">No people found</h2>
            <p className="mt-2 text-sm text-[#7c8999]">Try a different name or research topic.</p>
            {(query || selectedTag) ? (
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setQuery("");
                  setSelectedTag("");
                  setPage(1);
                }}
                className="mt-5 min-h-11 border border-[#151729] px-6 text-sm font-semibold"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}
