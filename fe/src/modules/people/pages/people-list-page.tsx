import LecturerCard from "@/components/people/lecturer-card";
import dummyLecturers from "@/data/dummy-lecturers.json";
import type { PersonLite } from "@/types/person";

const categories = [
  "Artificial Intelligence",
  "Cybersecurity & Privacy",
  "Data & Knowledge System",
  "Human-Centered Computing",
  "Networks & Distributed Systems",
  "Software & Computing System",
];

export default function PeopleListPage() {
  return (
    <main id="main-content" className="min-h-screen bg-white px-4 pb-16 pt-28 sm:px-8">
      <div className="page-container">
        <h1 className="mb-12 text-center text-3xl font-bold text-ink">People</h1>

        <div className="mb-6 max-w-sm">
          <label htmlFor="lecturer-search" className="sr-only">
            Search lecturer name
          </label>
          <input
            id="lecturer-search"
            type="search"
            placeholder="Search name"
            className="w-full border border-line bg-white p-2.5 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-focus"
          />
        </div>

        <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className="flex min-h-16 items-start bg-surface p-3 text-left text-sm leading-tight text-ink transition-colors hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-6 gap-y-8">
          {dummyLecturers.map((lecturer) => (
            <LecturerCard
              key={lecturer.id}
              lecturer={lecturer as PersonLite}
            />
          ))}
          {dummyLecturers.slice(0, 3).map((lecturer) => (
            <LecturerCard
              key={`${lecturer.id}-copy`}
              lecturer={lecturer as PersonLite}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
