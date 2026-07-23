"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import TopicTag from "@/components/global/topic-tag";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  apiRequest,
  getProjectPeople,
  type PaginatedResult,
  type Project,
  type ResearchTag,
} from "@/lib/api";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";

const PAGE_SIZE = 8;

function projectPeriod(project: Project): string {
  if (!project.start_year && !project.end_year) return "Period not specified";
  if (project.start_year && !project.end_year) return `${project.start_year} – Present`;
  if (!project.start_year && project.end_year) return `Until ${project.end_year}`;
  return project.start_year === project.end_year
    ? String(project.start_year)
    : `${project.start_year} – ${project.end_year}`;
}

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [status, setStatus] = useState("");
  const [tags, setTags] = useState<ResearchTag[]>([]);
  const [result, setResult] = useState<PaginatedResult<Project> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const debouncedQuery = useDebouncedValue(query);

  useEffect(() => {
    const controller = new AbortController();
    apiRequest<ResearchTag[]>("research/tags", {
      signal: controller.signal,
      query: { is_active: true },
    })
      .then(setTags)
      .catch(() => {
        if (!controller.signal.aborted) setTags([]);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    apiRequest<PaginatedResult<Project>>("projects/paginated", {
      signal: controller.signal,
      query: {
        page,
        limit: PAGE_SIZE,
        search: debouncedQuery,
        tag_slug: tag,
        status,
        visibility: "PUBLIC",
        sort_by: "created_at",
        sort_order: "desc",
      },
    })
      .then((data) => {
        setResult(data);
        setError("");
      })
      .catch((requestError: Error) => {
        if (!controller.signal.aborted) {
          setResult(null);
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [debouncedQuery, page, status, tag]);

  return (
    <main id="main-content" className="bg-white pb-20 pt-24 text-ink sm:pt-28">
      <div className="page-container">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Research", href: "/research" },
            { label: "Research & Projects" },
          ]}
        />

        <h1 className="pb-10 pt-7 text-center text-4xl font-bold text-dteti-blue sm:text-5xl">
          Projects
        </h1>

        <section aria-label="Project filters" className="flex flex-col gap-3 lg:flex-row">
          <label className="relative block w-full lg:max-w-xl">
            <span className="sr-only">Search projects</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={18}
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setLoading(true);
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search title, partner, or funding source"
              className="min-h-12 w-full border border-line bg-white py-2 pl-10 pr-3 text-base text-ink placeholder:text-muted focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </label>

          <label>
            <span className="sr-only">Research topic</span>
            <select
              value={tag}
              onChange={(event) => {
                setLoading(true);
                setTag(event.target.value);
                setPage(1);
              }}
              className="min-h-12 w-full border border-line bg-white px-3 text-sm text-ink focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus lg:w-64"
            >
              <option value="">All research topics</option>
              {tags.map((researchTag) => (
                <option key={researchTag.id} value={researchTag.slug}>
                  {researchTag.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Project status</span>
            <select
              value={status}
              onChange={(event) => {
                setLoading(true);
                setStatus(event.target.value);
                setPage(1);
              }}
              className="min-h-12 w-full border border-line bg-white px-3 text-sm text-ink focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus lg:w-48"
            >
              <option value="">All statuses</option>
              <option value="PLANNED">Planned</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </label>
        </section>

        <p className="mt-5 text-sm text-muted" aria-live="polite">
          {loading
            ? "Loading projects…"
            : `${result?.total || 0} ${result?.total === 1 ? "project" : "projects"} found`}
        </p>

        {loading ? (
          <div className="grid min-h-64 place-items-center" role="status">
            <LoaderCircle className="animate-spin text-dteti-blue" aria-hidden="true" />
            <span className="sr-only">Loading projects</span>
          </div>
        ) : error ? (
          <div className="mt-10 bg-surface px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-dteti-blue">
              Project data is temporarily unavailable
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted">{error}</p>
          </div>
        ) : result && result.data.length > 0 ? (
          <>
            <section className="mt-10 space-y-6" aria-label="Project results">
              {result.data.map((project) => {
                const projectTags = (project.research_tags || [])
                  .map((relation) => relation.tag)
                  .filter((item): item is ResearchTag => Boolean(item));
                const people = getProjectPeople(project);

                return (
                  <article
                    id={project.slug}
                    key={project.id}
                    className="brand-gradient px-6 py-7 text-white sm:px-12 sm:py-9"
                  >
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                      <span className="font-bold text-dteti-yellow">
                        {project.status || "PLANNED"}
                      </span>
                      <span className="text-white/85">{projectPeriod(project)}</span>
                    </div>
                    <h2 className="mt-4 text-xl font-bold leading-tight text-white sm:text-2xl">
                      {project.title}
                    </h2>
                    {project.description ? (
                      <p className="mt-3 max-w-4xl text-sm leading-6 text-white/90 sm:text-base">
                        {project.description}
                      </p>
                    ) : null}
                    {projectTags.length > 0 ? (
                      <div className="mt-5 flex flex-wrap gap-3">
                        {projectTags.map((researchTag) => (
                          <TopicTag key={researchTag.id}>{researchTag.name}</TopicTag>
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-6 grid gap-2 text-sm leading-6 text-white/90 sm:grid-cols-2">
                      <p>
                        <span className="font-semibold text-white">People: </span>
                        {people.length > 0
                          ? people.map((person) => person.full_name).join(", ")
                          : "Not assigned"}
                      </p>
                      <p>
                        <span className="font-semibold text-white">Funding: </span>
                        {project.funding_source || "Not specified"}
                      </p>
                    </div>
                    {project.partner_names ? (
                      <p className="mt-2 text-sm text-white/90">
                        <span className="font-semibold text-white">Partners: </span>
                        {project.partner_names}
                      </p>
                    ) : null}
                    <a
                      href={`#${project.slug}`}
                      className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-md bg-white px-6 text-sm font-semibold text-dteti-ink transition-colors hover:bg-dteti-blue-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dteti-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-dteti-blue"
                    >
                      Project details
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </a>
                  </article>
                );
              })}
            </section>

            {result.total_pages > 1 ? (
              <nav
                className="mt-10 flex items-center justify-center gap-4"
                aria-label="Project pagination"
              >
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => {
                    setLoading(true);
                    setPage((value) => Math.max(1, value - 1));
                  }}
                  className="inline-flex min-h-11 items-center gap-2 border border-line px-4 text-sm font-semibold disabled:opacity-45"
                >
                  <ChevronLeft size={17} aria-hidden="true" />
                  Previous
                </button>
                <span className="text-sm text-muted">
                  Page {page} of {result.total_pages}
                </span>
                <button
                  type="button"
                  disabled={page >= result.total_pages}
                  onClick={() => {
                    setLoading(true);
                    setPage((value) => value + 1);
                  }}
                  className="inline-flex min-h-11 items-center gap-2 border border-line px-4 text-sm font-semibold disabled:opacity-45"
                >
                  Next
                  <ChevronRight size={17} aria-hidden="true" />
                </button>
              </nav>
            ) : null}
          </>
        ) : (
          <div className="mt-10 bg-surface px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-dteti-blue">No projects found</h2>
            <p className="mt-2 text-sm text-muted">
              Try another project name or research topic.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
