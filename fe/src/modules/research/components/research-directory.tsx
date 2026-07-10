import { FileText, Search, UserRound } from "lucide-react";
import Breadcrumbs from "@/components/global/breadcrumbs";
import WireframePlaceholder from "@/components/global/wireframe-placeholder";

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

function ResearchTag({ label }: { label: string }) {
  return (
    <span className="inline-flex min-h-8 items-center rounded-md border border-ink bg-white px-3 text-sm font-semibold text-ink">
      {label}
    </span>
  );
}

function ResearchDirectoryCard({ item }: { item: ResearchDirectoryItem }) {
  return (
    <WireframePlaceholder className="rounded-xl px-6 py-10">
      <article>
        <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink">
          {item.title}
        </h2>
        <div className="mt-7 flex flex-wrap gap-5">
          {item.tags.map((tag) => (
            <ResearchTag key={`${item.title}-${tag}`} label={tag} />
          ))}
        </div>
        <div className="mt-8 flex items-center gap-8 text-base text-ink">
          <span className="inline-flex items-center gap-2">
            <UserRound size={20} aria-hidden="true" />
            {item.lecturers}
          </span>
          <span className="inline-flex items-center gap-2">
            <FileText size={20} aria-hidden="true" />
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
  return (
    <main id="main-content" className="bg-white pt-16 text-ink">
      <div className="page-container py-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Research", href: "/research" },
            { label: breadcrumbCurrent },
          ]}
        />
      </div>

      <section className="page-container pb-12 pt-2">
        <h1 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold tracking-[-0.025em] text-ink">
          {title}
        </h1>

        <form className="mx-auto mt-6 max-w-2xl" role="search">
          <label className="sr-only" htmlFor="research-search">
            {searchPlaceholder}
          </label>
          <div className="flex min-h-14 items-center gap-5 rounded-xl border border-ink bg-white px-8">
            <Search size={20} aria-hidden="true" />
            <input
              id="research-search"
              type="search"
              placeholder={searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-lg font-semibold text-ink outline-none placeholder:text-[oklch(0.55_0_0)]"
            />
          </div>
        </form>

        <div className="mx-auto mt-10 grid max-w-6xl gap-10">
          {items.map((item) => (
            <ResearchDirectoryCard key={item.title} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
