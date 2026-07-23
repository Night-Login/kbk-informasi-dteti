"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import TopicTag from "@/components/global/topic-tag";
import LecturerCard from "@/modules/people/components/lecturer-card";
import dummyLecturers from "@/data/dummy-lecturers.json";
import { publicationData } from "@/modules/publication/data/publication.data";
import type { PersonLite } from "@/types/person";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const lecturers = dummyLecturers.slice(0, 20) as PersonLite[];
const publicationYears = [2022, 2023, 2024, 2025, 2026];

export default function TagResearchAreasPage() {
  const [lecturerQuery, setLecturerQuery] = useState("");
  const [publicationQuery, setPublicationQuery] = useState("");
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");

  const visibleLecturers = useMemo(() => {
    const normalizedQuery = lecturerQuery.trim().toLocaleLowerCase();

    return lecturers.filter((lecturer) =>
      lecturer.fullName.toLocaleLowerCase().includes(normalizedQuery),
    );
  }, [lecturerQuery]);

  const visiblePublications = useMemo(() => {
    const normalizedQuery = publicationQuery.trim().toLocaleLowerCase();

    return publicationData.filter((publication) => {
      const year = Number(publication.date.match(/\d{4}/)?.[0] ?? 0);
      const matchesQuery = [
        publication.title,
        publication.type,
        publication.authors,
        ...publication.tags,
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery);
      const matchesFrom = !fromYear || year >= Number(fromYear);
      const matchesTo = !toYear || year <= Number(toYear);

      return matchesQuery && matchesFrom && matchesTo;
    });
  }, [fromYear, publicationQuery, toYear]);

  return (
    <main id="main-content" className="bg-white pb-20 pt-24 text-ink sm:pt-28">
      <div className="page-container">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Research", href: "/research" },
            { label: "Research Areas", href: "/research-areas" },
            { label: "Machine Learning" },
          ]}
        />

        <header className="pb-10 pt-8">
          <h1 className="text-4xl font-bold text-dteti-blue sm:text-5xl">
            Machine Learning
          </h1>
          <p className="mt-3 text-base text-muted">
            12 Lecturers <span aria-hidden="true">|</span> 48 Publications
          </p>
        </header>

        <section aria-labelledby="lecturers-heading">
          <h2 id="lecturers-heading" className="text-2xl font-bold text-ink sm:text-3xl">
            Lecturers
          </h2>
          <label className="relative mt-4 block max-w-sm">
            <span className="sr-only">Search lecturer name</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={17}
              aria-hidden="true"
            />
            <input
              type="search"
              value={lecturerQuery}
              onChange={(event) => setLecturerQuery(event.target.value)}
              placeholder="Search name"
              className="min-h-11 w-full border border-line bg-white py-2 pl-10 pr-3 text-sm text-ink placeholder:text-muted focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </label>

          <p className="sr-only" aria-live="polite">
            Showing {visibleLecturers.length}{" "}
            {visibleLecturers.length === 1 ? "lecturer" : "lecturers"}
          </p>

          {visibleLecturers.length > 0 ? (
            <div className="mt-7 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-7">
              {visibleLecturers.map((lecturer, index) => (
                <LecturerCard
                  key={lecturer.id}
                  lecturer={lecturer}
                  priority={index < 4}
                />
              ))}
            </div>
          ) : (
            <p className="mt-7 bg-surface px-6 py-12 text-center text-muted">
              No lecturers match that name.
            </p>
          )}
        </section>

        <section className="mt-16" aria-labelledby="related-publication-heading">
          <h2
            id="related-publication-heading"
            className="text-2xl font-bold text-dteti-blue sm:text-3xl"
          >
            Related Publication
          </h2>

          <div className="mt-5 flex flex-col gap-3 sm:max-w-2xl">
            <label className="relative block">
              <span className="sr-only">Search related publications</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                size={17}
                aria-hidden="true"
              />
              <input
                type="search"
                value={publicationQuery}
                onChange={(event) => setPublicationQuery(event.target.value)}
                placeholder="Search topic, name, or type"
                className="min-h-11 w-full border border-line bg-white py-2 pl-10 pr-3 text-sm text-ink placeholder:text-muted focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3 text-sm text-ink">
              <span>Filter year:</span>
              <label>
                <span className="sr-only">From year</span>
                <select
                  value={fromYear}
                  onChange={(event) => setFromYear(event.target.value)}
                  className="min-h-9 border border-line bg-white px-3 focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
                >
                  <option value="">From</option>
                  {publicationYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="sr-only">To year</span>
                <select
                  value={toYear}
                  onChange={(event) => setToYear(event.target.value)}
                  className="min-h-9 border border-line bg-white px-3 focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
                >
                  <option value="">To</option>
                  {publicationYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <p className="sr-only" aria-live="polite">
            Showing {visiblePublications.length}{" "}
            {visiblePublications.length === 1 ? "publication" : "publications"}
          </p>

          {visiblePublications.length > 0 ? (
            <ul className="mt-7 divide-y divide-line">
              {visiblePublications.map((publication) => (
                <li key={publication.title} className="py-5 first:pt-0">
                  <Link
                    href="/publication"
                    className="text-lg font-bold text-dteti-blue hover:underline sm:text-xl"
                  >
                    {publication.title}
                  </Link>
                  <p className="mt-1 text-sm leading-6 text-ink">
                    {publication.type} &bull; {publication.date} &bull; {publication.authors}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {publication.tags.map((tag) => (
                      <TopicTag key={tag}>{tag}</TopicTag>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-7 bg-surface px-6 py-12 text-center text-muted">
              No publications match those filters.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
