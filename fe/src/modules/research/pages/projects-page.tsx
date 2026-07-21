"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import TopicTag from "@/components/global/topic-tag";
import { projectData } from "@/modules/research/data/research.data";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const projectTopics = Array.from(new Set(projectData.flatMap((project) => project.tags)));

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return projectData.filter((project) => {
      const matchesQuery = [project.title, project.description, ...project.people]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery);
      const matchesTopic = !topic || project.tags.some((tag) => tag === topic);

      return matchesQuery && matchesTopic;
    });
  }, [query, topic]);

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

        <section aria-label="Project filters" className="max-w-md">
          <label className="relative block">
            <span className="sr-only">Search projects</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={18}
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Project"
              className="min-h-12 w-full border border-line bg-white py-2 pl-10 pr-3 text-base text-ink placeholder:text-muted focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </label>

          <label className="mt-3 block">
            <span className="sr-only">Research topic</span>
            <select
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              className="min-h-10 w-full border border-line bg-white px-3 text-sm text-ink focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus sm:w-auto"
            >
              <option value="">Research Topic</option>
              {projectTopics.map((projectTopic) => (
                <option key={projectTopic} value={projectTopic}>
                  {projectTopic}
                </option>
              ))}
            </select>
          </label>
        </section>

        <p className="sr-only" aria-live="polite">
          Showing {visibleProjects.length}{" "}
          {visibleProjects.length === 1 ? "project" : "projects"}
        </p>

        {visibleProjects.length > 0 ? (
          <section className="mt-10 space-y-6" aria-label="Project results">
            {visibleProjects.map((project) => (
              <article
                id={project.id}
                key={project.id}
                className="brand-gradient min-h-64 px-6 py-7 text-white sm:px-12 sm:py-9"
              >
                {project.status === "Planned" ? (
                  <p className="mb-5 text-sm font-bold text-dteti-yellow">
                    Status: Planned
                  </p>
                ) : null}
                <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl">
                  {project.title}
                </h2>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-white/90 sm:text-base">
                  {project.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {project.tags.map((tag) => (
                    <TopicTag key={tag}>{tag}</TopicTag>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-6 text-white/90">
                  {project.people.join(", ")}
                  <br />
                  {project.period}
                </p>
                <Link
                  href={`/projects#${project.id}`}
                  className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-md bg-white px-6 text-sm font-semibold text-dteti-ink transition-colors hover:bg-dteti-blue-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dteti-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-dteti-blue"
                >
                  View Project
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </section>
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
