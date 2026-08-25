"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/global/breadcrumbs";
import { supervisorSteps } from "@/modules/academic/data/academic.data";
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
  const graduateWebsite = content?.settings.graduate_website_url ||
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

        <div className="mx-auto mt-16 max-w-6xl">
          <h2 className="text-2xl font-extrabold text-dteti-blue sm:text-3xl">Programs</h2>
          {programs.length > 0 ? (
            <div className="mt-8 grid gap-10 md:grid-cols-2">
              {programs.map((program) => (
                <article key={program.id}>
                  <h3 className="text-2xl font-extrabold text-dteti-blue-deep">
                    {program.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink">{program.overview}</p>
                  {program.information ? (
                    <p className="mt-4 text-sm text-ink">{program.information}</p>
                  ) : null}
                  <LargeWireframeLink
                    href={program.link_url}
                    label="View Program Information"
                  />
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
          <div className="brand-gradient mt-6 grid gap-10 rounded-2xl px-8 py-12 text-white md:grid-cols-2 md:px-16">
            {scholarships.length === 0 ? (
              <p className="text-sm text-white/90">
                Scholarship opportunities will appear once they are published.
              </p>
            ) : null}
            {scholarships.map((scholarship) => (
              <article key={scholarship.id}>
                <h3 className="text-2xl font-extrabold text-white">
                  {scholarship.title}
                </h3>
                <p className="mt-2 text-sm text-white/90">
                  {scholarship.overview}
                </p>
                {scholarship.information ? (
                  <p className="mt-4 text-sm text-white/90">{scholarship.information}</p>
                ) : null}
                <LargeWireframeLink
                  href={scholarship.link_url}
                  label="View Scholarship Information"
                  tone="white"
                />
              </article>
            ))}
          </div>
        </div>

        {/* FAQ Section - Centered with proper spacing */}
        <section className="mx-auto mt-20 max-w-4xl sm:mt-24">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-dteti-blue sm:text-3xl">
              Frequently Asked Questions (FAQs)
            </h2>
            <p className="mt-2 text-sm text-muted">
              Find answers and guidance for common academic procedures
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-line bg-surface p-6 sm:p-10 shadow-xs">
            <h3 className="text-xl font-extrabold text-dteti-blue-deep sm:text-2xl">
              How to contact a potential supervisor?
            </h3>

            <ol className="mt-6 space-y-4">
              {supervisorSteps.map((step, index) => (
                <li key={step.title} className="rounded-xl border border-line/70 bg-white p-5 shadow-xs">
                  <h4 className="text-base font-extrabold text-ink sm:text-lg">
                    {index + 1}. {step.title}
                  </h4>
                  <p className="mt-2 text-sm text-ink/80">{step.description}</p>
                  {step.href ? (
                    <Link
                      href={step.href}
                      className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-lg border border-line bg-surface px-4 text-xs font-bold text-dteti-blue transition-colors hover:border-dteti-blue hover:bg-dteti-blue-soft/30"
                    >
                      {step.actionLabel}
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </section>

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
            href={graduateWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-6 text-sm font-extrabold text-dteti-blue-deep shadow-xs transition-transform hover:scale-105 hover:bg-dteti-blue-soft"
          >
            Visit DTETI Graduate Website
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </section>
      </section>
    </main>
  );
}
