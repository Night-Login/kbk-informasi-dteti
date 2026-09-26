"use client";

import type { ResearchCluster } from "@/lib/api";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useState } from "react";

type PeopleFilterPanelProps = {
  clusters: ResearchCluster[];
  query: string;
  selectedTag: string;
  onQueryChange: (value: string) => void;
  onTagChange: (value: string) => void;
};

export default function PeopleFilterPanel({
  clusters,
  query,
  selectedTag,
  onQueryChange,
  onTagChange,
}: PeopleFilterPanelProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="border-b-2 border-[#151729] bg-white" aria-label="Filter people">
      <div className="flex min-h-14 items-center justify-between gap-4 border-b border-[#e3e3e3] px-5 sm:px-[5%]">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="inline-flex min-h-11 items-center gap-3 px-2 text-sm font-semibold text-[#151729] transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-expanded={expanded}
          aria-controls="people-topic-filters"
        >
          {expanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
          <span>Filter research area</span>
        </button>

        <label className="flex h-10 w-full max-w-80 items-center gap-2 rounded border border-[#7c8999] px-4 text-[#7c8999] focus-within:outline-2 focus-within:outline-offset-2 sm:h-8">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Search people</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search research people"
            className="min-w-0 flex-1 bg-transparent text-sm text-[#151729] outline-none placeholder:text-[#7c8999]"
          />
        </label>
      </div>

      <div
        id="people-topic-filters"
        hidden={!expanded}
        className="grid gap-0 border-t border-[#151729] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        {clusters.map((cluster) => (
          <div
            key={cluster.id}
            className="border-b border-[#aeb5bd] px-6 py-6 sm:border-r xl:border-b-0 last:border-r-0"
          >
            <h2 className="mb-4 text-sm font-semibold text-[#151729]">
              {cluster.name}
            </h2>
            <div className="grid gap-2">
              {(cluster.tags || []).map((tag) => {
                const checked = selectedTag === tag.slug;
                return (
                  <label key={tag.id} className="flex cursor-pointer items-start gap-2 text-sm leading-5 text-[#151729]">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onTagChange(checked ? "" : tag.slug)}
                      className="mt-1 size-3 rounded-sm border-[#151729] accent-[#151729]"
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
