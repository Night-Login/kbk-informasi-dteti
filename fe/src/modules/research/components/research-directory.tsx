"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import WireframePlaceholder from "@/components/global/wireframe-placeholder";
import { FileText, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type ResearchDirectoryItem = {
  title: string;
  tags: readonly string[];
  lecturers: number;
  publications: number;
};

type ResearchDirectoryProps = {
  title: string;
  searchPlaceholder: string;
  breadcrumbCurrent: string;
  items: readonly ResearchDirectoryItem[];
};

function ResearchDirectoryCard({ item }: { item: ResearchDirectoryItem }) {
  return (
    <WireframePlaceholder className="rounded-xl px-6 py-9 shadow-[0_2px_8px_rgba(35,65,100,0.08)] sm:px-10 sm:py-11">
      <article>
        <h2 className="text-2xl font-bold text-dteti-blue sm:text-3xl">
          {item.title}
        </h2>
        <div className="mt-7 flex flex-wrap gap-4">
          {item.tags.map((tag) => (
            <Link
              key={`${item.title}-${tag}`}
              href="/tag-research-areas"
              className="inline-flex min-h-9 items-center rounded-md border border-dteti-ink/70 bg-dteti-yellow px-3.5 text-sm font-semibold text-dteti-ink transition-colors hover:bg-dteti-yellow/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            >
              {tag}
            </Link>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-8 text-base text-ink">
          <span className="inline-flex items-center gap-2" title="Lecturers">
            <UserRound size={21} aria-hidden="true" />
            <span className="sr-only">Lecturers:</span>
            {item.lecturers}
          </span>
          <span className="inline-flex items-center gap-2" title="Publications">
            <FileText size={21} aria-hidden="true" />
            <span className="sr-only">Publications:</span>
            {item.publications}
          </span>
        </div>
      </article>
    </WireframePlaceholder>
  );
}

export default function ResearchDirectory({
  title,
  searchPlaceholder,
  breadcrumbCurrent,
  items,
}: ResearchDirectoryProps) {
  const [query, setQuery] = useState("");

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return items.filter((item) =>
      [item.title, ...item.tags]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }, [items, query]);

  return (
    <main id="main-content" className="bg-white pb-20 pt-24 text-ink sm:pt-28">
      <div className="page-container">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Research", href: "/research" },
            { label: breadcrumbCurrent },
          ]}
        />

        <section className="pb-4 pt-7">
          <h1 className="text-center text-4xl font-bold tracking-[-0.025em] text-dteti-blue sm:text-5xl">
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
            <div className="flex min-h-16 items-center gap-4 rounded-xl border border-line bg-white px-6 focus-within:border-dteti-blue focus-within:ring-2 focus-within:ring-focus sm:px-8">
              <Search className="text-muted" size={21} aria-hidden="true" />
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
            <div className="mt-10 grid gap-10">
              {visibleItems.map((item) => (
                <ResearchDirectoryCard key={item.title} item={item} />
              ))}
            </div>
          ) : (
            <div className="mt-10 bg-surface px-6 py-16 text-center">
              <h2 className="text-xl font-bold text-dteti-blue">
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
