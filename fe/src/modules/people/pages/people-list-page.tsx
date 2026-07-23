"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import LecturerCard from "@/modules/people/components/lecturer-card";
import PeopleFilterModal, {
  defaultPeopleFilterValues,
  countActiveFilters,
  type PeopleFilterValues,
} from "@/modules/people/components/people-filter-modal";
import dummyLecturers from "@/data/dummy-lecturers.json";
import type { PersonLite } from "@/types/person";
import { Search, SlidersHorizontal } from "lucide-react";
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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<PeopleFilterValues>(
    defaultPeopleFilterValues
  );

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  const visibleLecturers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    let filtered = lecturers.filter(({ lecturer, category }) => {
      const matchesName = lecturer.fullName
        .toLocaleLowerCase()
        .includes(normalizedQuery);
      const matchesCategory = !activeCategory || category === activeCategory;

      const matchesSupervision =
        filters.supervisionStatus === "all"
          ? true
          : filters.supervisionStatus === "available"
          ? lecturer.isSupervisorAvailable
          : !lecturer.isSupervisorAvailable;

      return matchesName && matchesCategory && matchesSupervision;
    });

    // Handle Sorting
    if (filters.sortBy === "name" || !filters.sortBy) {
      filtered = [...filtered].sort((a, b) => {
        const cmp = a.lecturer.fullName.localeCompare(b.lecturer.fullName);
        return filters.sortOrder === "desc" ? -cmp : cmp;
      });
    }

    return filtered;
  }, [activeCategory, filters, query]);

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

        {/* Search & Filter Row (Full Width) */}
        <div className="mb-6 flex w-full items-center gap-3">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              size={17}
              aria-hidden="true"
            />
            <input
              id="lecturer-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name"
              className="min-h-11 w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </div>

          {/* Filter Modal Trigger Button */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-dteti-ink transition-all hover:border-dteti-blue hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
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

        {/* Category Tabs */}
        <div className="mb-4 flex w-full items-center gap-3 overflow-x-auto pb-2">
          <button
            type="button"
            aria-pressed={!activeCategory}
            onClick={() => setActiveCategory("")}
            className={[
              "flex min-h-12 shrink-0 items-center justify-center rounded-lg border px-5 py-3 text-center text-sm font-bold leading-tight text-dteti-ink transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
              !activeCategory
                ? "border-dteti-blue bg-dteti-yellow shadow-[inset_0_-3px_0_var(--dteti-blue)]"
                : "border-dteti-yellow bg-white hover:bg-dteti-yellow/20",
            ].join(" ")}
          >
            All
          </button>
          {categories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => toggleCategory(category)}
                className={[
                  "flex min-h-12 shrink-0 items-center justify-center rounded-lg border px-5 py-3 text-center text-sm font-bold leading-tight text-dteti-ink transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
                  isActive
                    ? "border-dteti-blue bg-dteti-yellow shadow-[inset_0_-3px_0_var(--dteti-blue)]"
                    : "border-dteti-yellow bg-white hover:bg-dteti-yellow/20",
                ].join(" ")}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Showing People Counter Below Tabs */}
        <div className="mb-8 flex items-center justify-between">
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

      {/* Filter Modal Component */}
      <PeopleFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={filters}
        onApplyFilters={setFilters}
      />
    </main>
  );
}

