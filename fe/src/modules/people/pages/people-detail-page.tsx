"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import DataTable, {
  type DataTableColumn,
  type DataTableFilter,
  type DataTableRow,
} from "@/components/global/data-table";
import TopicTag from "@/components/global/topic-tag";
import {
  ApiError,
  apiRequest,
  getApiAssetUrl,
  lecturerIsAvailable,
  type Lecturer,
  type Publication,
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

const adviseeColumns: DataTableColumn[] = [
  { key: "no", label: "No", className: "w-16 text-center" },
  { key: "name", label: "Student Name", className: "min-w-48" },
  { key: "level", label: "Level", className: "w-24 text-center" },
  { key: "project", label: "Project", className: "min-w-80" },
  { key: "researchArea", label: "Research Areas", className: "min-w-40" },
];

const adviseeFilters: DataTableFilter[] = [
  { label: "Show All", value: "all" },
  { label: "Bachelor (S1)", value: "S1" },
  { label: "Master (S2)", value: "S2" },
  { label: "Doctor (S3)", value: "S3" },
];

function publicationTimestamp(publication: Publication) {
  if (publication.publication_date) {
    const timestamp = Date.parse(publication.publication_date);
    if (Number.isFinite(timestamp)) return timestamp;
  }

  return Date.UTC(publication.year || 0, 0, 1);
}

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
  const latestPublications = useMemo(
    () =>
      (lecturer?.publications || [])
        .map((relation) => relation.publication)
        .filter(
          (publication): publication is Publication => Boolean(publication),
        )
        .sort((first, second) => {
          const dateDifference =
            publicationTimestamp(second) - publicationTimestamp(first);
          return dateDifference || first.title.localeCompare(second.title);
        })
        .slice(0, 5),
    [lecturer],
  );
  const adviseeRows = useMemo<DataTableRow[]>(
    () =>
      (lecturer?.advisees || []).map((advisee, index) => ({
        id: advisee.id,
        filterValue: advisee.level,
        cells: {
          no: index + 1,
          name: advisee.full_name,
          level: advisee.level,
          project: advisee.project || "—",
          researchArea: advisee.research_area || "—",
        },
        actionHref: advisee.profile_href || undefined,
      })),
    [lecturer],
  );
  const degrees = lecturer?.degrees || [];
  const teachingAssistants = lecturer?.teaching_assistants || [];
  const awards = lecturer?.awards || [];

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
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <li key={tag.id}>
                          <Link
                            href={`/tag-research-areas/${tag.slug}`}
                            className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dteti-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-dteti-blue"
                          >
                            <TopicTag>{tag.name}</TopicTag>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-white/80">
                      Research tags have not been assigned yet.
                    </p>
                  )}
                </div>

                <div>
                  <h2 className="text-base font-semibold text-white">
                    Teaching Assistants
                  </h2>
                  {teachingAssistants.length > 0 ? (
                    <ul className="mt-3 space-y-3 text-sm">
                      {teachingAssistants.map((assistant) => (
                        <li key={assistant.id || assistant.full_name}>
                          {assistant.profile_href ? (
                            <Link
                              href={assistant.profile_href}
                              className="font-semibold text-white hover:underline"
                            >
                              {assistant.full_name}
                            </Link>
                          ) : (
                            <p className="font-semibold text-white">
                              {assistant.full_name}
                            </p>
                          )}
                          {assistant.email ? (
                            <a
                              href={`mailto:${assistant.email}`}
                              className="mt-1 flex items-center gap-2 text-white/80 hover:text-white hover:underline"
                            >
                              <Mail size={14} aria-hidden="true" />
                              {assistant.email}
                            </a>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-white/80">
                      Teaching assistant data has not been added yet.
                    </p>
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

          <aside className="space-y-8">
            <section aria-labelledby="metrics-heading">
              <h2 id="metrics-heading" className="flex items-center gap-2 text-lg font-bold text-dteti-blue">
                <BarChart3 size={20} aria-hidden="true" />
                Research Metrics
              </h2>
              {lecturer.metrics ? (
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
              ) : (
                <p className="mt-3 text-sm leading-6 text-muted">
                  Research metrics have not been added yet.
                </p>
              )}
            </section>

            <section aria-labelledby="education-heading">
              <h2 id="education-heading" className="text-lg font-bold text-dteti-blue">
                Education
              </h2>
              {degrees.length > 0 ? (
                <ul className="mt-3 space-y-3 text-sm leading-6 text-ink">
                  {degrees.map((degree) => (
                    <li key={degree}>{degree}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-6 text-muted">
                  Education history has not been added yet.
                </p>
              )}
            </section>
          </aside>
        </div>

        <section className="mt-14" aria-labelledby="advisees-heading">
          <h2 id="advisees-heading" className="mb-5 text-2xl font-bold text-dteti-blue sm:text-3xl">
            Advisees
          </h2>
          <DataTable
            ariaLabel="Lecturer advisees"
            columns={adviseeColumns}
            rows={adviseeRows}
            filters={adviseeFilters}
            actionLabel="Action"
            emptyMessage="Advisee data has not been added yet."
            searchPlaceholder="Search advisees"
            statusLabel="Supervisor status:"
            statusTone={isAvailable ? "available" : "unavailable"}
          />
        </section>

        <section className="mt-14" aria-labelledby="publications-heading">
          <h2 id="publications-heading" className="text-2xl font-bold text-dteti-blue sm:text-3xl">
            Latest Publications
          </h2>
          {latestPublications.length > 0 ? (
            <ul className="mt-6 divide-y divide-line border-t border-line">
              {latestPublications.map((publication) => (
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
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 bg-surface px-6 py-10 text-sm text-muted">
              No publications have been linked to this profile.
            </p>
          )}
        </section>

        <section className="mt-12" aria-labelledby="awards-heading">
          <h2 id="awards-heading" className="text-2xl font-bold text-dteti-blue sm:text-3xl">
            Awards &amp; Honours
          </h2>
          {awards.length > 0 ? (
            <ul className="mt-6 space-y-4 text-base text-ink">
              {awards.map((award) => (
                <li key={award}>{award}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 bg-surface px-6 py-10 text-sm text-muted">
              Awards and honours have not been added yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
