"use client";

import PeopleHero from "@/modules/people/components/people-hero";
import {
  ApiError,
  apiRequest,
  getApiAssetUrl,
  type Lecturer,
  type Publication,
} from "@/lib/api";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function publicationTimestamp(publication: Publication) {
  if (publication.publication_date) {
    const timestamp = Date.parse(publication.publication_date);
    if (Number.isFinite(timestamp)) return timestamp;
  }
  return Date.UTC(publication.year || 0, 0, 1);
}

function publicationDate(publication: Publication) {
  if (!publication.publication_date) return publication.year ? String(publication.year) : "";
  const date = new Date(publication.publication_date);
  return Number.isNaN(date.getTime())
    ? String(publication.year || "")
    : new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);
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

  const interests = useMemo(
    () => [...new Set(tags.map((tag) => tag.cluster?.name).filter(Boolean))] as string[],
    [tags],
  );

  const latestPublications = useMemo(
    () =>
      (lecturer?.publications || [])
        .map((relation) => relation.publication)
        .filter((publication): publication is Publication => Boolean(publication))
        .sort((first, second) => publicationTimestamp(second) - publicationTimestamp(first))
        .slice(0, 2),
    [lecturer],
  );

  if (loading) {
    return (
      <main id="main-content" className="min-h-screen bg-[#e6ecf2] text-[#151729]">
        <PeopleHero />
        <div className="grid min-h-80 place-items-center text-[#1a4872]" role="status">
          <div className="flex items-center gap-3">
            <LoaderCircle className="animate-spin" aria-hidden="true" />
            <span>Loading lecturer profile…</span>
          </div>
        </div>
      </main>
    );
  }

  if (error || !lecturer) {
    return (
      <main id="main-content" className="min-h-screen bg-[#e6ecf2] text-[#151729]">
        <PeopleHero />
        <div className="mx-auto max-w-4xl px-5 py-16 text-center">
          <div className="rounded-[8px] bg-white p-10">
            <h2 className="text-2xl font-bold text-[#1a4872]">Lecturer profile not found</h2>
            <p className="mt-3 text-sm text-[#4f5054]">{error || "The requested profile is unavailable."}</p>
            <Link href="/people" className="mt-6 inline-flex min-h-11 items-center rounded-[8px] bg-[#1a4872] px-6 font-semibold text-white hover:bg-[#133859]">
              <ArrowLeft size={17} aria-hidden="true" />
              <span className="ml-2">All people</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const photoUrl = getApiAssetUrl(lecturer.photo_url);
  const education = lecturer.education || [];
  const overview = lecturer.bio || lecturer.short_bio || "Biography has not been added yet.";

  return (
    <main id="main-content" className="min-h-screen bg-[#e6ecf2] text-[#151729]">
      <PeopleHero />

      <div className="mx-auto w-[90%] max-w-[1296px] py-12 sm:py-14">
        <Link
          href="/people"
          className="inline-flex min-h-11 min-w-44 items-center justify-center gap-2 rounded-[8px] border border-[#1a4872] bg-white px-5 text-sm font-semibold text-[#1a4872] transition-colors hover:bg-[#1a4872] hover:text-white"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          All people
        </Link>

        <section className="mt-4 grid overflow-hidden rounded-[8px] bg-white lg:grid-cols-[420px_minmax(0,1fr)]" aria-labelledby="profile-name">
          <div className="relative min-h-[340px] bg-[#e6ecf2] lg:min-h-[381px]">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={`Portrait of ${lecturer.full_name}`}
                fill
                priority
                unoptimized
                sizes="(min-width: 1024px) 420px, 90vw"
                className="object-cover"
              />
            ) : (
              <div className="grid size-full place-items-center bg-[#e6ecf2] text-7xl font-bold text-[#1a4872]">
                {lecturer.full_name.charAt(0)}
              </div>
            )}
          </div>

          <div className="grid gap-10 px-6 py-7 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(230px,0.75fr)] lg:px-11">
            <div className="flex min-w-0 flex-col">
              <h1 id="profile-name" className="text-3xl font-bold leading-tight text-[#1a4872] sm:text-4xl">
                {lecturer.full_name}
              </h1>
              <p className="mt-1 text-lg text-[#151729]">{lecturer.academic_title || "Lecturer"}</p>
              {lecturer.email ? (
                <a href={`mailto:${lecturer.email}`} className="mt-3 w-fit text-base text-[#1a4872] hover:underline">
                  {lecturer.email}
                </a>
              ) : null}

              {tags.length ? (
                <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                  {tags.slice(0, 3).map((tag) => (
                    <li key={tag.id}>
                      <Link
                        href={`/tag-research-areas/${tag.slug}`}
                        className="inline-flex min-h-9 items-center rounded border border-[#1a4872]/30 bg-[#e6ecf2] px-4 text-xs font-medium text-[#151729] hover:bg-[#d5e0eb]"
                      >
                        {tag.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#1a4872] sm:text-2xl">Education History</h2>
              {education.length ? (
                <ul className="mt-3 space-y-3 text-sm leading-6 text-[#151729] sm:text-base">
                  {education.slice(0, 3).map((item) => (
                    <li key={item.id}>
                      <p>{item.degree}{item.field ? ` · ${item.field}` : ""}</p>
                      <p>{item.institution}{item.year ? ` · ${item.year}` : ""}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-[#4f5054]">Education history has not been added yet.</p>
              )}
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-8 rounded-[8px] bg-white p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16">
          <section aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="text-2xl font-bold text-[#1a4872] sm:text-3xl">Overview</h2>
            <div className="mt-5 max-w-3xl space-y-5 text-base leading-7 text-[#151729] sm:text-lg sm:leading-8">
              {overview.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </section>

          <aside className="space-y-7">
            <section aria-labelledby="expertise-heading">
              <h2 id="expertise-heading" className="text-xl font-bold text-[#1a4872] sm:text-2xl">Speciality &amp; expertise</h2>
              <ul className="mt-3 space-y-1 text-base leading-7 text-[#151729]">
                {tags.length ? tags.slice(0, 5).map((tag) => <li key={tag.id}>{tag.name}</li>) : <li>Not specified yet</li>}
              </ul>
            </section>
            <section aria-labelledby="interests-heading">
              <h2 id="interests-heading" className="text-xl font-bold text-[#1a4872] sm:text-2xl">Research interests</h2>
              <ul className="mt-3 space-y-1 text-base leading-7 text-[#151729]">
                {interests.length ? interests.map((interest) => <li key={interest}>{interest}</li>) : <li>Not specified yet</li>}
              </ul>
            </section>
          </aside>
        </div>

        <section className="mt-6 rounded-[8px] bg-white p-6 sm:p-10" aria-labelledby="publications-heading">
          <h2 id="publications-heading" className="text-2xl font-bold text-[#1a4872] sm:text-3xl">Recent Publications</h2>
          {latestPublications.length ? (
            <ul className="mt-6 space-y-7">
              {latestPublications.map((publication) => (
                <li key={publication.id}>
                  <a
                    href={publication.url || `/publication#${publication.slug}`}
                    target={publication.url ? "_blank" : undefined}
                    rel={publication.url ? "noopener noreferrer" : undefined}
                    className="text-lg font-bold leading-snug text-[#1a4872] hover:underline sm:text-xl"
                  >
                    {publication.title}
                  </a>
                  <p className="mt-1 text-sm text-[#4f5054]">
                    {[publication.publication_type || publication.venue, publicationDate(publication), publication.authors_text]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {tags.length ? (
                    <ul className="mt-2 flex flex-wrap gap-3">
                      {tags.slice(0, 2).map((tag) => (
                        <li key={tag.id} className="rounded border border-[#1a4872]/30 bg-[#e6ecf2] px-2.5 py-1 text-xs text-[#151729]">
                          {tag.name}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-[#4f5054]">No publications have been linked to this profile.</p>
          )}

          <Link
            href={`/publication?lecturer=${encodeURIComponent(lecturer.slug)}`}
            className="mt-8 inline-flex min-h-10 items-center gap-3 rounded-[8px] border border-white bg-[#1a4872] px-8 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#133859]"
          >
            Explore More Publications
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}
