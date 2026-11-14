"use client";

import DiscoveryPageHero from "@/components/global/discovery-page-hero";
import PeopleFilterPanel from "@/modules/people/components/people-filter-panel";
import ResearchResultCard from "@/modules/research/components/research-result-card";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { apiRequest, type ResearchSummary, type PaginatedResult, type Project, type Publication, type Lecturer } from "@/lib/api";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";

export type ResearchView = "Publication" | "Project" | "People";
export type ResearchResult = Project | Publication | Lecturer;
const endpoints = { Publication: "publications", Project: "projects", People: "lecturers" };

export default function ResearchPage({ initialCluster = "" }: { initialCluster?: string }) {
  const [view, setView] = useState<ResearchView>("Project");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("view") === "Publication") {
      setView("Publication");
    }
  }, []);
  const [query, setQuery] = useState("");
  const [cluster, setCluster] = useState(initialCluster);
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);
  const [research, setResearch] = useState<ResearchSummary | null>(null);
  const [filterError, setFilterError] = useState("");
  const [result, setResult] = useState<PaginatedResult<ResearchResult> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const search = useDebouncedValue(query, 300);

  useEffect(() => {
    const controller = new AbortController();
    apiRequest<ResearchSummary>("research", { signal: controller.signal })
      .then((data) => { setResearch(data); setFilterError(""); })
      .catch(() => { if (!controller.signal.aborted) setFilterError("Research topics are temporarily unavailable."); });
    return () => controller.abort();
  }, [retry]);
  useEffect(() => {
    const controller = new AbortController();
    apiRequest<PaginatedResult<ResearchResult>>(`${endpoints[view]}/paginated`, {
      signal: controller.signal,
      query: { page, limit: 12, search, tag_slug: tag, cluster_slug: cluster,
        ...(view === "People" ? { is_active: true, sort_by: "full_name", sort_order: "asc" } :
          view === "Publication" ? { sort_by: "year", sort_order: "desc" } : { visibility: "PUBLIC", sort_by: "start_year", sort_order: "desc" }),
      },
    }).then((data) => { setResult(data); setError(""); })
      .catch((requestError: Error) => { if (!controller.signal.aborted) { setError(requestError.message); setResult(null); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [view, search, tag, cluster, page, retry]);
  function clearFilters() { setLoading(true); setQuery(""); setTag(""); setCluster(""); setPage(1); }
  return <main id="main-content" className="min-h-screen bg-[#e6ecf2] text-[#151729]">
    <DiscoveryPageHero title="Research" />
    <div className="bg-[#fbfbfb] pt-10"><PeopleFilterPanel clusters={research?.clusters || []} query={query} selectedTag={tag} selectedCluster={cluster}
      onQueryChange={(value) => { setLoading(true); setQuery(value); setPage(1); }}
      onTagChange={(value) => { setLoading(true); setTag(value); setCluster(""); setPage(1); }} searchLabel={`Search ${view.toLowerCase()}`}
      toolbar={<div className="order-last flex w-full justify-center gap-8 lg:absolute lg:left-1/2 lg:order-none lg:w-auto lg:-translate-x-1/2 lg:gap-12" aria-label="Research content">
        {(["Publication", "Project"] as const).map((tab) => <button key={tab} type="button" aria-pressed={view === tab} aria-controls="research-results"
          onClick={() => { if (view !== tab) { setLoading(true); setView(tab); setPage(1); } }}
          className={`min-h-11 border-b-2 px-1 text-base font-semibold text-[#1a4872] transition-colors hover:bg-[#e6ecf2] sm:text-xl ${view === tab ? "border-[#1a4872]" : "border-transparent"}`}>{tab}</button>)}
      </div>} /></div>
    {filterError && <p role="status" className="mx-auto mt-4 w-[90%] text-sm">{filterError} <button type="button" className="text-[#1a4872] underline" onClick={() => setRetry((value) => value + 1)}>Retry topics</button></p>}
    <section id="research-results" aria-label={`${view} results`} aria-busy={loading} className="mx-auto w-[90%] max-w-[1160px] py-10">
      <p className="mb-5 text-sm text-[#4f5054]" aria-live="polite">{loading ? "Loading research…" : `${result?.total || 0} ${view.toLowerCase()} results`}</p>
      {cluster && (
        <p className="mb-3 text-sm font-semibold text-[#1a4872]">
          Research cluster: {research?.clusters.find((item) => item.slug === cluster)?.name ?? cluster.replaceAll("-", " ")}
        </p>
      )}
      {(query || tag || cluster) && <button type="button" onClick={clearFilters} className="mb-6 min-h-10 rounded-[8px] border border-[#1a4872] bg-white px-4 text-sm font-semibold text-[#1a4872] transition-colors hover:bg-[#1a4872] hover:text-white">Clear filters</button>}
      {loading ? <div role="status" className="grid min-h-64 place-items-center text-[#1a4872]"><LoaderCircle className="animate-spin" aria-label="Loading research" /></div> : error ?
        <div className="rounded-[8px] bg-white p-8 text-center"><h2 className="text-xl font-bold text-[#1a4872]">Research is temporarily unavailable</h2><p className="mt-3">{error}</p><button type="button" className="mt-5 min-h-10 rounded-[8px] bg-[#1a4872] px-6 font-semibold text-white hover:bg-[#133859]" onClick={() => { setLoading(true); setRetry((value) => value + 1); }}>Try again</button></div> : result?.data.length ?
        <div className="grid gap-8">{result.data.map((item, index) => <ResearchResultCard key={`${view}-${item.id}`} view={view} item={item} index={index} />)}</div> :
        <div className="rounded-[8px] bg-white px-6 py-16 text-center"><h2 className="text-xl font-bold text-[#1a4872]">No {view.toLowerCase()} results found</h2><p className="mt-2">{query || tag || cluster ? "Try another search or clear your filters." : `No ${view.toLowerCase()} records have been published yet.`}</p></div>}
      {!loading && !error && result && result.total_pages > 1 && <nav aria-label="Research pagination" className="mt-10 flex items-center justify-center gap-4">
        <button type="button" disabled={page <= 1} onClick={() => { setLoading(true); setPage(page - 1); }} className="inline-flex min-h-11 items-center gap-1 rounded-[8px] border border-[#1a4872] bg-white px-4 font-semibold text-[#1a4872] transition-colors hover:bg-[#1a4872] hover:text-white disabled:opacity-40"><ChevronLeft size={18} />Previous</button>
        <span className="text-sm font-medium">Page {page} of {result.total_pages}</span>
        <button type="button" disabled={page >= result.total_pages} onClick={() => { setLoading(true); setPage(page + 1); }} className="inline-flex min-h-11 items-center gap-1 rounded-[8px] border border-[#1a4872] bg-white px-4 font-semibold text-[#1a4872] transition-colors hover:bg-[#1a4872] hover:text-white disabled:opacity-40">Next<ChevronRight size={18} /></button>
      </nav>}
    </section>
  </main>;
}
