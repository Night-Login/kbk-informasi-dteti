"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import LecturerCard from "@/components/people/lecturer-card";
import dummyLecturers from "@/data/dummy-lecturers.json";
import type { PersonLite } from "@/types/person";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

const categories = [
  "Artificial Intelligence",
  "Cybersecurity & Privacy",
  "Data & Knowledge System",
  "Human-Centered Computing",
  "Networks & Distributed Systems",
];

const lecturers = dummyLecturers.map((lecturer, index) => ({
  lecturer: lecturer as PersonLite,
  category: categories[index % categories.length],
}));

export default function PeopleListPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const visibleLecturers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return lecturers.filter(({ lecturer, category }) => {
      const matchesName = lecturer.fullName
        .toLocaleLowerCase()
        .includes(normalizedQuery);
      const matchesCategory = !activeCategory || category === activeCategory;

      return matchesName && matchesCategory;
    });
  }, [activeCategory, query]);

  function toggleCategory(category: string) {
    setActiveCategory((current) => (current === category ? "" : category));
  }

  return (
    <main id="main-content" className="min-h-screen bg-white pb-20 pt-24 sm:pt-28">
      <div className="page-container">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "People" }]} />

        <h1 className="mb-10 mt-6 text-center text-3xl font-bold text-dteti-blue sm:text-4xl">
          People
        </h1>

        <div className="mb-6 max-w-sm">
          <label htmlFor="lecturer-search" className="sr-only">
            Search lecturer name
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={17}
              aria-hidden="true"
            />
            <input
              id="lecturer-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name"
              className="min-h-11 w-full border border-line bg-white py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-muted focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => toggleCategory(category)}
                className={[
                  "flex min-h-16 items-start border p-3 text-left text-sm font-medium leading-tight text-dteti-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
                  isActive
                    ? "border-dteti-blue bg-dteti-yellow shadow-[inset_0_-4px_0_var(--dteti-blue)]"
                    : "border-dteti-yellow bg-dteti-yellow hover:bg-dteti-yellow/80",
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
            value={activeCategory}
            onChange={(event) => setActiveCategory(event.target.value)}
            className="min-h-10 w-full border border-line bg-white px-3 text-sm text-muted focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus sm:w-64"
          >
            <option value="">Filter Tag</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <p className="text-sm text-muted" aria-live="polite">
            Showing {visibleLecturers.length}{" "}
            {visibleLecturers.length === 1 ? "person" : "people"}
          </p>
        </div>

        {visibleLecturers.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-x-6 gap-y-8">
            {visibleLecturers.map(({ lecturer }, index) => (
              <LecturerCard
                key={lecturer.id}
                lecturer={lecturer}
                priority={index < 4}
              />
            ))}
          </div>
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
    </main>
  );
}
