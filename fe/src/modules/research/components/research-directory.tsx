"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import { FileText, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type ResearchDirectoryItem = {
  slug: string;
  title: string;
  description?: string;
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

function ResearchDirectoryCard({ item }: { item: ResearchDirectoryItem }) {
  return (
    <article className="border border-line bg-white px-6 py-9 sm:px-10 sm:py-11">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-start">
        <div>
        <h2 className="text-2xl font-bold text-dteti-blue sm:text-3xl">
          {item.title}
        </h2>
        {item.description ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            {item.description}
          </p>
        ) : null}
        <div className="mt-7 flex flex-wrap gap-4">
          {item.tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tag-research-areas/${tag.slug}`}
              className="inline-flex min-h-9 items-center rounded-md border border-dteti-ink/70 bg-dteti-yellow px-3.5 text-sm font-semibold text-dteti-ink transition-colors hover:bg-dteti-yellow/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            >
              {tag.name}
            </Link>
          ))}
        </div>
        </div>
        <div className="flex items-center gap-8 border-t border-line pt-5 text-base text-ink lg:flex-col lg:items-start lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
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
            <div className="flex min-h-16 items-center gap-4 border border-line bg-white px-6 focus-within:border-dteti-blue focus-within:ring-2 focus-within:ring-focus sm:px-8">
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
