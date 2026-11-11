"use client";

import type { ResearchCluster } from "@/lib/api";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useState, type ReactNode } from "react";

type PeopleFilterPanelProps = {
  clusters: ResearchCluster[];
  query: string;
  selectedTag: string;
  selectedCluster?: string;
  onQueryChange: (value: string) => void;
  onTagChange: (value: string) => void;
  toolbar?: ReactNode;
  searchLabel?: string;
};

export default function PeopleFilterPanel({
  clusters,
  query,
  selectedTag,
  selectedCluster,
  onQueryChange,
  onTagChange,
  toolbar,
  searchLabel = "Search people",
}: PeopleFilterPanelProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="border-b-[3px] border-[#1a4872] bg-[#fbfbfb]" aria-label="Filter research area">
      <div className="relative flex min-h-14 flex-wrap items-center justify-between gap-4 border-b border-[#e3e3e3] px-5 py-2 sm:px-[5%]">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="inline-flex min-h-11 items-center gap-3 px-2 text-sm font-semibold text-[#1a4872] transition-colors hover:bg-[#e6ecf2] focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-expanded={expanded}
          aria-controls="people-topic-filters"
        >
          {expanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
          <span>Filter research area</span>
        </button>

        {toolbar}

        <label className="flex h-10 w-full max-w-80 items-center gap-2 rounded border border-[#1a4872] bg-white px-4 text-[#1a4872] focus-within:outline-2 focus-within:outline-offset-2 sm:h-8">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">{searchLabel}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={toolbar ? searchLabel : "Search research people"}
            className="min-w-0 flex-1 bg-transparent text-sm text-[#151729] outline-none placeholder:text-[#7c8999]"
          />
        </label>
      </div>

      <div
        id="people-topic-filters"
        hidden={!expanded}
        className="grid gap-0 border-t border-[#1a4872] bg-[#fbfbfb] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        {clusters.map((cluster) => (
          <div
            key={cluster.id}
            className="border-b border-[#d5e0eb] px-6 py-6 sm:border-r xl:border-b-0 last:border-r-0"
          >
            <h2 className="mb-4 text-sm font-bold text-[#1a4872]">
              {cluster.name}
            </h2>
            <div className="grid gap-2">
              {(cluster.tags || []).map((tag) => {
                const checked = selectedTag === tag.slug || selectedCluster === cluster.slug;
                return (
                  <label key={tag.id} className="flex cursor-pointer items-start gap-2 text-sm leading-5 text-[#151729]">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onTagChange(checked ? "" : tag.slug)}
                      className="mt-1 size-3 rounded-sm border-[#1a4872] accent-[#1a4872]"
                    />
                    <span>{tag.name}</span>
                  </label>
                );
              })}
              {!cluster.tags?.length ? (
                <p className="text-xs text-[#7c8999]">No topics available.</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
