"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import { FileText, Search, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useEffect, useMemo, useState } from "react";

type ResearchDirectoryItem = {
  slug: string;
  title: string;
  description?: string;
  imageUrl?: string;
  tags: readonly { name: string; slug: string }[];
  lecturers: number;
  publications: number;
};

type ResearchDirectoryProps = {
  title: string;
  searchPlaceholder: string;
  breadcrumbCurrent: string;
  items: readonly ResearchDirectoryItem[];
};

function ResearchDirectoryCard({
  item,
  index = 0,
}: {
  item: ResearchDirectoryItem;
  index?: number;
}) {
  return (
    <article
      id={`cluster-${item.slug}`}
      style={{ "--card-index": index } as CSSProperties}
      className="discovery-stagger-card discovery-card-lift scroll-mt-28 overflow-hidden rounded-[8px] bg-white"
    >
      <div className={item.imageUrl ? "grid lg:grid-cols-[minmax(250px,32%)_1fr]" : ""}>
        {item.imageUrl ? (
          <div className="relative min-h-52 bg-surface-strong sm:min-h-64 lg:min-h-full">
            <Image
              src={item.imageUrl}
              alt={`${item.title} research area`}
              fill
              sizes="(min-width: 1024px) 32vw, 100vw"
              className="object-cover"
              unoptimized={item.imageUrl.startsWith("http") || item.imageUrl.startsWith("/uploads/")}
            />
          </div>
        ) : null}
        <div className="px-6 py-8 sm:px-10 sm:py-9">
          <h2 className="text-2xl font-bold text-[#1a4872] sm:text-3xl">
            {item.title}
          </h2>
          {item.description ? (
            <p className="mt-3 max-w-4xl text-sm leading-6 text-[#151729]">
              {item.description}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            {item.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tag-research-areas/${tag.slug}`}
                className="inline-flex min-h-9 items-center rounded-[4px] border border-[#1a4872]/30 bg-[#e6ecf2] px-3.5 text-sm font-medium text-[#151729] transition-colors hover:bg-[#1a4872] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
              >
                {tag.name}
              </Link>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-6 border-t border-line pt-5 text-sm font-semibold text-ink sm:gap-8">
            <span className="inline-flex items-center gap-2 text-[#151729]" title="Lecturers">
              <UserRound size={19} className="text-[#1a4872]" aria-hidden="true" />
              <span>{item.lecturers} Lecturers</span>
            </span>
            <span className="inline-flex items-center gap-2 text-[#151729]" title="Publications">
              <FileText size={19} className="text-[#1a4872]" aria-hidden="true" />
              <span>{item.publications} Publications</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ResearchDirectory({
  title,
  searchPlaceholder,
  breadcrumbCurrent,
  items,
}: ResearchDirectoryProps) {
  const [query, setQuery] = useState("");
  useEffect(() => {
    const scrollToCluster = () => {
      if (window.location.hash.startsWith("#cluster-")) {
        try { document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView(); } catch { /* Ignore malformed URL fragments. */ }
      }
    };
    scrollToCluster();
    window.addEventListener("hashchange", scrollToCluster);
    return () => window.removeEventListener("hashchange", scrollToCluster);
  }, [items]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return items.filter((item) =>
      [item.title, item.description || "", ...item.tags.map((tag) => tag.name)]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }, [items, query]);

  return (
    <main id="main-content" className="min-h-screen bg-[#e6ecf2] pb-20 pt-24 text-ink sm:pt-28">
      <div className="page-container">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Research", href: "/research" },
            { label: breadcrumbCurrent },
          ]}
        />

        <section className="pb-4 pt-7">
          <h1 className="text-center text-4xl font-bold tracking-[-0.025em] text-[#1a4872] sm:text-5xl">
            {title}
          </h1>

          <form
            className="mx-auto mt-7 max-w-3xl"
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="sr-only" htmlFor="research-search">
              {searchPlaceholder}
            </label>
            <div className="flex min-h-14 items-center gap-4 rounded-[8px] border border-[#1a4872] bg-white px-6 focus-within:ring-2 focus-within:ring-focus sm:px-8">
              <Search className="text-[#1a4872]" size={21} aria-hidden="true" />
              <input
                id="research-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent text-base font-semibold text-ink outline-none placeholder:text-muted sm:text-lg"
              />
            </div>
          </form>

          <p className="sr-only" aria-live="polite">
            Showing {visibleItems.length}{" "}
            {visibleItems.length === 1 ? "research area" : "research areas"}
          </p>

          {visibleItems.length > 0 ? (
            <div className="mt-10 grid gap-8">
              {visibleItems.map((item, index) => (
                <ResearchDirectoryCard key={item.title} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[8px] bg-white px-6 py-16 text-center">
              <h2 className="text-xl font-bold text-[#1a4872]">
                No research areas found
              </h2>
              <p className="mt-2 text-sm text-muted">
                Try another research area or topic keyword.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
