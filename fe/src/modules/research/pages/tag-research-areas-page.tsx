"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import TopicTag from "@/components/global/topic-tag";
import LecturerCard from "@/components/people/lecturer-card";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  apiRequest,
  getApiAssetUrl,
  getPublicationTags,
  lecturerIsAvailable,
  type Lecturer,
  type PaginatedResult,
  type Publication,
  type ResearchTag,
} from "@/lib/api";
import type { PersonLite } from "@/types/person";
import { ExternalLink, LoaderCircle, Search } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const currentYear = new Date().getFullYear();
const publicationYears = Array.from({ length: 25 }, (_, index) => currentYear - index);

function toPerson(lecturer: Lecturer): PersonLite {
  return {
    id: lecturer.slug,
    sourceId: lecturer.id,
    fullName: lecturer.full_name,
    position: lecturer.academic_title || "Lecturer",
    isSupervisorAvailable: lecturerIsAvailable(lecturer),
    profilePictureUrl: getApiAssetUrl(lecturer.photo_url),
    contact: {
      labName: lecturer.research_tags
        ?.map((relation) => relation.tag?.cluster?.name)
        .filter(Boolean)
        .join(", "),
      email: lecturer.email || undefined,
    },
  };
}

export default function TagResearchAreasPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [tag, setTag] = useState<ResearchTag | null>(null);
  const [lecturerQuery, setLecturerQuery] = useState("");
  const [publicationQuery, setPublicationQuery] = useState("");
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [lecturers, setLecturers] = useState<PaginatedResult<Lecturer> | null>(null);
  const [publications, setPublications] =
    useState<PaginatedResult<Publication> | null>(null);
  const [loadingTag, setLoadingTag] = useState(true);
  const [loadingLecturers, setLoadingLecturers] = useState(true);
  const [loadingPublications, setLoadingPublications] = useState(true);
  const [error, setError] = useState("");
  const debouncedLecturerQuery = useDebouncedValue(lecturerQuery);
  const debouncedPublicationQuery = useDebouncedValue(publicationQuery);

  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();
    apiRequest<ResearchTag>(`research/tags/slug/${encodeURIComponent(slug)}`, {
      signal: controller.signal,
    })
      .then((data) => {
        setTag(data);
        setError("");
      })
      .catch((requestError: Error) => {
        if (!controller.signal.aborted) setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingTag(false);
      });
    return () => controller.abort();
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();
    apiRequest<PaginatedResult<Lecturer>>("lecturers/paginated", {
      signal: controller.signal,
      query: {
        tag_slug: slug,
        search: debouncedLecturerQuery,
        is_active: true,
        page: 1,
        limit: 48,
        sort_by: "full_name",
        sort_order: "asc",
      },
    })
      .then(setLecturers)
      .catch(() => {
        if (!controller.signal.aborted) setLecturers(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingLecturers(false);
      });
    return () => controller.abort();
  }, [debouncedLecturerQuery, slug]);

  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();
    apiRequest<PaginatedResult<Publication>>("publications/paginated", {
      signal: controller.signal,
      query: {
        tag_slug: slug,
        search: debouncedPublicationQuery,
        min_year: fromYear,
        max_year: toYear,
        page: 1,
        limit: 50,
        sort_by: "year",
        sort_order: "desc",
      },
    })
      .then(setPublications)
      .catch(() => {
        if (!controller.signal.aborted) setPublications(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingPublications(false);
      });
    return () => controller.abort();
  }, [debouncedPublicationQuery, fromYear, slug, toYear]);

  if (loadingTag) {
    return (
      <main id="main-content" className="grid min-h-screen place-items-center bg-white pt-20">
        <div className="flex items-center gap-3 text-dteti-blue" role="status">
          <LoaderCircle className="animate-spin" aria-hidden="true" />
          <span className="font-semibold">Loading research topic…</span>
        </div>
      </main>
    );
  }

  if (error || !tag) {
    return (
      <main id="main-content" className="min-h-screen bg-white pb-20 pt-28">
        <div className="page-container bg-surface px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-dteti-blue">
            Research topic not found
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            {error || "The requested research topic is unavailable."}
          </p>
          <Link
            href="/research-areas"
            className="mt-6 inline-flex min-h-11 items-center bg-dteti-blue px-5 text-sm font-semibold text-white"
          >
            Browse research areas
          </Link>
        </div>
      </main>
    );
  }

  const people = lecturers?.data.map(toPerson) || [];

  return (
    <main id="main-content" className="bg-white pb-20 pt-24 text-ink sm:pt-28">
      <div className="page-container">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Research", href: "/research" },
            { label: "Research Areas", href: "/research-areas" },
            { label: tag.name },
          ]}
        />

        <header className="pb-10 pt-8">
          <p className="text-sm font-semibold text-muted">
            {tag.cluster?.name || "Research topic"}
          </p>
          <h1 className="mt-2 text-4xl font-bold text-dteti-blue sm:text-5xl">
            {tag.name}
          </h1>
          {tag.description ? (
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
              {tag.description}
            </p>
          ) : null}
          <p className="mt-4 text-base text-muted">
            {lecturers?.total || 0} lecturers <span aria-hidden="true">·</span>{" "}
            {publications?.total || 0} publications
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
              onChange={(event) => {
                setLoadingLecturers(true);
                setLecturerQuery(event.target.value);
              }}
              placeholder="Search lecturer name"
              className="min-h-11 w-full border border-line bg-white py-2 pl-10 pr-3 text-sm text-ink placeholder:text-muted focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </label>

          {loadingLecturers ? (
            <p className="mt-7 text-sm text-muted">Loading lecturers…</p>
          ) : people.length > 0 ? (
            <div className="mt-7 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-7">
              {people.map((lecturer, index) => (
                <LecturerCard
                  key={lecturer.sourceId || lecturer.id}
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
            Related Publications
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
                onChange={(event) => {
                  setLoadingPublications(true);
                  setPublicationQuery(event.target.value);
                }}
                placeholder="Search title, author, venue, or DOI"
                className="min-h-11 w-full border border-line bg-white py-2 pl-10 pr-3 text-sm text-ink placeholder:text-muted focus:border-dteti-blue focus:outline-none focus:ring-2 focus:ring-focus"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3 text-sm text-ink">
              <span>Publication year:</span>
              <label>
                <span className="sr-only">From year</span>
                <select
                  value={fromYear}
                  onChange={(event) => {
                    setLoadingPublications(true);
                    setFromYear(event.target.value);
                  }}
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
                  onChange={(event) => {
                    setLoadingPublications(true);
                    setToYear(event.target.value);
                  }}
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

          {loadingPublications ? (
            <p className="mt-7 text-sm text-muted">Loading publications…</p>
          ) : publications && publications.data.length > 0 ? (
            <ul className="mt-7 divide-y divide-line border-t border-line">
              {publications.data.map((publication) => {
                const publicationTags = getPublicationTags(publication);
                const href =
                  publication.url ||
                  (publication.doi
                    ? `https://doi.org/${publication.doi}`
                    : `/publication#${publication.slug}`);
                const external = href.startsWith("http");

                return (
                  <li key={publication.id} className="py-5">
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-start gap-2 text-lg font-bold text-dteti-blue hover:underline sm:text-xl"
                    >
                      {publication.title}
                      {external ? (
                        <ExternalLink className="mt-1 shrink-0" size={15} aria-hidden="true" />
                      ) : null}
                    </a>
                    <p className="mt-1 text-sm leading-6 text-ink">
                      {[
                        publication.publication_type,
                        publication.year,
                        publication.authors_text,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {publicationTags.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {publicationTags.map((researchTag) => (
                          <TopicTag key={researchTag.id}>{researchTag.name}</TopicTag>
                        ))}
                      </div>
                    ) : null}
                  </li>
                );
              })}
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
