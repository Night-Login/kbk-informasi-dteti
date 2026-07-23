"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import TopicTag from "@/components/global/topic-tag";
import {
  ApiError,
  apiRequest,
  getApiAssetUrl,
  lecturerIsAvailable,
  type Lecturer,
} from "@/lib/api";
import {
  BarChart3,
  ExternalLink,
  GraduationCap,
  Link2,
  LoaderCircle,
  Mail,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function PeopleDetailPage() {
  const params = useParams<{ id: string }>();
  const identifier = params?.id;
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!identifier) return;
    const controller = new AbortController();

    apiRequest<Lecturer>(`lecturers/slug/${encodeURIComponent(identifier)}`, {
      signal: controller.signal,
    })
      .catch((requestError: Error) => {
        if (requestError instanceof ApiError && requestError.status === 404) {
          return apiRequest<Lecturer>(`lecturers/${encodeURIComponent(identifier)}`, {
            signal: controller.signal,
          });
        }
        throw requestError;
      })
      .then((data) => {
        setLecturer(data);
        setError("");
      })
      .catch((requestError: Error) => {
        if (!controller.signal.aborted) {
          setError(requestError.message);
          setLecturer(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [identifier]);

  const tags = useMemo(
    () =>
      lecturer?.research_tags
        ?.map((relation) => relation.tag)
        .filter((tag): tag is NonNullable<typeof tag> => Boolean(tag)) || [],
    [lecturer],
  );

  if (loading) {
    return (
      <main id="main-content" className="grid min-h-screen place-items-center bg-white pt-20">
        <div className="flex items-center gap-3 text-dteti-blue" role="status">
          <LoaderCircle className="animate-spin" aria-hidden="true" />
          <span className="font-semibold">Loading lecturer profile…</span>
        </div>
      </main>
    );
  }

  if (error || !lecturer) {
    return (
      <main id="main-content" className="min-h-screen bg-white pb-20 pt-28">
        <div className="page-container">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "People", href: "/people" },
              { label: "Profile unavailable" },
            ]}
          />
          <div className="mt-10 border border-line bg-surface px-6 py-16 text-center">
            <h1 className="text-2xl font-bold text-dteti-blue">
              Lecturer profile not found
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
              {error || "The requested lecturer profile is unavailable."}
            </p>
            <Link
              href="/people"
              className="mt-6 inline-flex min-h-11 items-center bg-dteti-blue px-5 text-sm font-semibold text-white"
            >
              Back to People
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const photoUrl = getApiAssetUrl(lecturer.photo_url);
  const isAvailable = lecturerIsAvailable(lecturer);
  const academicLinks = [
    lecturer.sinta_id
      ? {
          label: "SINTA",
          href: `https://sinta.kemdikbud.go.id/authors/profile/${lecturer.sinta_id}`,
          icon: GraduationCap,
        }
      : null,
    lecturer.scopus_author_id
      ? {
          label: "Scopus",
          href: `https://www.scopus.com/authid/detail.uri?authorId=${lecturer.scopus_author_id}`,
          icon: Link2,
        }
      : null,
    lecturer.google_scholar_url
      ? {
          label: "Google Scholar",
          href: lecturer.google_scholar_url,
          icon: Search,
        }
      : lecturer.google_scholar_id
        ? {
            label: "Google Scholar",
            href: `https://scholar.google.com/citations?user=${lecturer.google_scholar_id}`,
            icon: Search,
          }
        : null,
    lecturer.orcid_id
      ? {
          label: "ORCID",
          href: `https://orcid.org/${lecturer.orcid_id}`,
          icon: ExternalLink,
        }
      : null,
  ].filter((link): link is NonNullable<typeof link> => Boolean(link));

  return (
    <main id="main-content" className="min-h-screen bg-white pb-20 pt-24 sm:pt-28">
      <div className="page-container">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "People", href: "/people" },
            { label: lecturer.full_name },
          ]}
        />

        <section className="mt-6 overflow-hidden" aria-labelledby="profile-name">
          <div className="grid lg:grid-cols-[20rem_minmax(0,1fr)]">
            <div className="relative min-h-72 bg-surface-strong lg:min-h-[26rem]">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={`Portrait of ${lecturer.full_name}`}
                  fill
                  sizes="(min-width: 1024px) 20rem, 100vw"
                  className="object-cover"
                  unoptimized
                  priority
                />
              ) : (
                <div className="grid size-full place-items-center text-7xl font-bold text-muted">
                  {lecturer.full_name.charAt(0)}
                </div>
              )}
            </div>

            <div className="brand-gradient grid gap-10 p-6 text-white sm:p-10 xl:grid-cols-[minmax(0,1fr)_18rem] xl:p-12">
              <div>
                <h1
                  id="profile-name"
                  className="text-3xl font-bold leading-tight text-dteti-yellow sm:text-4xl"
                >
                  {lecturer.full_name}
                </h1>
                <p className="mt-2 text-lg font-semibold text-white">
                  {lecturer.academic_title || "Lecturer"}
                </p>
                <p className="mt-2 text-sm font-semibold text-white/90">
                  Supervision: {isAvailable ? "Available" : lecturer.supervision_status || "Unavailable"}
                </p>
                {lecturer.short_bio ? (
                  <p className="mt-6 max-w-3xl text-sm leading-6 text-white/90">
                    {lecturer.short_bio}
                  </p>
                ) : null}

                {lecturer.email ? (
                  <a
                    href={`mailto:${lecturer.email}`}
                    className="mt-6 inline-flex min-h-11 items-center gap-3 border border-white/55 px-4 text-sm font-semibold text-white hover:bg-white hover:text-dteti-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dteti-yellow"
                  >
                    <Mail size={17} aria-hidden="true" />
                    {lecturer.email}
                  </a>
                ) : null}
              </div>

              <aside className="space-y-7">
                <div>
                  <h2 className="text-base font-semibold text-white">Research Areas</h2>
                  {tags.length > 0 ? (
                    <ul className="mt-3 space-y-2 text-sm">
                      {tags.map((tag) => (
                        <li key={tag.id}>
                          <Link
                            href={`/tag-research-areas/${tag.slug}`}
                            className="font-semibold text-white underline decoration-white/60 underline-offset-4 hover:decoration-dteti-yellow"
                          >
                            {tag.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-white/80">No research tags listed.</p>
                  )}
                </div>

                {academicLinks.length > 0 ? (
                  <div>
                    <h2 className="text-base font-semibold text-white">Academic Profiles</h2>
                    <ul className="mt-3 space-y-3 text-sm">
                      {academicLinks.map(({ label, href, icon: Icon }) => (
                        <li key={label}>
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 hover:underline"
                          >
                            <Icon size={16} aria-hidden="true" />
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </aside>
            </div>
          </div>
        </section>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <section aria-labelledby="biography-heading">
            <h2 id="biography-heading" className="text-2xl font-bold text-dteti-blue sm:text-3xl">
              Biography
            </h2>
            <div className="mt-5 max-w-4xl space-y-5 text-base leading-8 text-ink">
              {(lecturer.bio || lecturer.short_bio || "Biography has not been added yet.")
                .split("\n\n")
                .map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
          </section>

          {lecturer.metrics ? (
            <aside aria-labelledby="metrics-heading">
              <h2 id="metrics-heading" className="flex items-center gap-2 text-lg font-bold text-dteti-blue">
                <BarChart3 size={20} aria-hidden="true" />
                Research Metrics
              </h2>
              <dl className="mt-4 divide-y divide-line border-y border-line text-sm">
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-muted">H-index</dt>
                  <dd className="font-semibold text-ink">{lecturer.metrics.h_index ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-muted">Citations</dt>
                  <dd className="font-semibold text-ink">{lecturer.metrics.total_citations ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-muted">SINTA score</dt>
                  <dd className="font-semibold text-ink">{lecturer.metrics.sinta_score ?? "—"}</dd>
                </div>
              </dl>
            </aside>
          ) : null}
        </div>

        <section className="mt-14" aria-labelledby="publications-heading">
          <h2 id="publications-heading" className="text-2xl font-bold text-dteti-blue sm:text-3xl">
            Publications
          </h2>
          {lecturer.publications && lecturer.publications.length > 0 ? (
            <ul className="mt-6 divide-y divide-line border-t border-line">
              {lecturer.publications.map((relation) => {
                const publication = relation.publication;
                if (!publication) return null;
                return (
                  <li key={publication.id} className="py-5">
                    <a
                      href={publication.url || `/publication#${publication.slug}`}
                      target={publication.url ? "_blank" : undefined}
                      rel={publication.url ? "noopener noreferrer" : undefined}
                      className="text-lg font-bold text-ink hover:text-dteti-blue hover:underline"
                    >
                      {publication.title}
                    </a>
                    <p className="mt-1 text-sm text-muted">
                      {[publication.publication_type, publication.venue, publication.year]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <TopicTag key={`${publication.id}-${tag.id}`}>{tag.name}</TopicTag>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-5 bg-surface px-6 py-10 text-sm text-muted">
              No publications have been linked to this profile.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
