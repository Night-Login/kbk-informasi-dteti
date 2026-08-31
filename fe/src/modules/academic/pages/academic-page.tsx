"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/global/breadcrumbs";
import { apiRequest, type AcademicPageContent } from "@/lib/api";

function LargeWireframeLink({
  href,
  label,
  tone = "gradient",
}: {
  href: string;
  label: string;
  tone?: "gradient" | "white";
}) {
  return (
    <Link
      href={href}
      {...(/^https?:\/\//.test(href)
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={`group mt-6 flex min-h-12 items-center justify-between px-8 text-base font-extrabold transition-colors ${
        tone === "white"
          ? "bg-white text-dteti-blue-deep hover:bg-dteti-blue-soft"
          : "brand-gradient text-white hover:brightness-105"
      }`}
    >
      <span>{label}</span>
      <ArrowUpRight
        className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        size={18}
        aria-hidden="true"
      />
    </Link>
  );
}

export default function AcademicPage() {
  const [content, setContent] = useState<AcademicPageContent | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    apiRequest<AcademicPageContent>("content/academic", { signal: controller.signal })
      .then(setContent)
      .catch(() => {
        if (!controller.signal.aborted) setContent(null);
      });

    return () => controller.abort();
  }, []);

  const programs = content?.programs || [];
  const scholarships = content?.scholarships || [];
  const postgraduateWebsite = content?.settings.graduate_website_url ||
    "https://pasca.jteti.ugm.ac.id/";

  return (
    <main id="main-content" className="bg-white pt-16 text-ink sm:pt-20">
      <div className="page-container py-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Academic" },
          ]}
        />
      </div>

      <section className="page-container pb-16 pt-2">
        <h1 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold tracking-[-0.025em] text-dteti-blue">
          Academic Programs and Scholarships
        </h1>

        <div className="mx-auto mt-16 max-w-6xl rounded-3xl bg-dteti-blue-soft/55 px-6 py-9 sm:px-10 sm:py-11 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-dteti-blue">
              Graduate study
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-dteti-blue-deep sm:text-3xl">
              Programs
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink/75">
              Compare DTETI graduate programs and open the official program page for detailed
              curriculum and admission information.
            </p>
          </div>
          {programs.length > 0 ? (
            <div className={`mt-8 grid gap-6 ${programs.length === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"}`}>
              {programs.map((program) => (
                <article
                  key={program.id}
                  className="flex h-full flex-col justify-between rounded-2xl border border-dteti-blue/15 bg-white p-6 shadow-xs"
                >
                  <div>
                    <h3 className="text-xl font-extrabold leading-7 text-dteti-blue-deep sm:text-2xl">
                      {program.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-ink">{program.overview}</p>
                    {program.information ? (
                      <p className="mt-4 text-sm leading-6 text-ink/75">{program.information}</p>
                    ) : null}
                  </div>
                  <LargeWireframeLink href={program.link_url} label="View Program Information" />
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-8 border border-line bg-surface px-5 py-6 text-sm text-muted">
              Graduate program information will appear once it is published.
            </p>
          )}
        </div>

        <div className="mx-auto mt-16 max-w-6xl sm:mt-20">
          <h2 className="text-2xl font-extrabold text-dteti-blue sm:text-3xl">Scholarships</h2>
          <div className="brand-gradient mt-6 grid gap-10 rounded-2xl px-8 py-12 text-white md:grid-cols-[0.85fr_1.15fr] md:px-12 lg:px-16">
            <div>
              <p className="max-w-xl text-sm leading-6 text-white/90">
                Explore funding opportunities for master&apos;s and doctoral study. The dedicated
                Scholarships page collects every opportunity published by the admin team.
              </p>
              <LargeWireframeLink
                href="/scholarships"
                label="View All Scholarships"
                tone="white"
              />
            </div>
            <div className="divide-y divide-white/25 border-y border-white/25">
              {scholarships.length === 0 ? (
                <p className="py-5 text-sm text-white/90">
                  Scholarship opportunities will appear once they are published.
                </p>
              ) : (
                scholarships.slice(0, 3).map((scholarship) => (
                  <article key={scholarship.id} className="py-5 first:pt-0 last:pb-0">
                    <h3 className="text-lg font-extrabold text-white">{scholarship.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-white/85">{scholarship.overview}</p>
                  </article>
                ))
              )}
              {scholarships.length > 3 ? (
                <p className="pt-5 text-xs font-bold text-white/80">
                  +{scholarships.length - 3} more published opportunities
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Need More Info Section - Centered Callout Banner */}
        <section className="mx-auto mt-20 max-w-4xl rounded-2xl brand-gradient p-8 text-center text-white sm:mt-24 sm:p-12">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Need more Information?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/90">
            Visit the official DTETI UGM graduate website for master’s and doctoral
            programs, admissions, academic information, and scholarship updates.
          </p>
          <Link
            href={postgraduateWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-6 text-sm font-extrabold text-dteti-blue-deep shadow-xs transition-transform hover:scale-105 hover:bg-dteti-blue-soft"
          >
            Visit DTETI Postgraduate Website
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </section>
      </section>
    </main>
  );
}
