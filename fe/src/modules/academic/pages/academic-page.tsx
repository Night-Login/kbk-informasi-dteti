import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/global/breadcrumbs";
import {
  academicPrograms,
  scholarships,
  supervisorSteps,
} from "@/modules/academic/data/academic.data";

function LargeWireframeLink({
  href,
  label,
  tone = "gray",
}: {
  href: string;
  label: string;
  tone?: "gray" | "white";
}) {
  return (
    <Link
      href={href}
      className={`mt-6 flex min-h-12 items-center justify-between px-8 text-base font-extrabold text-ink ${
        tone === "white" ? "bg-white" : "bg-[oklch(0.86_0_0)]"
      }`}
    >
      <span>{label}</span>
      <ArrowUpRight size={18} aria-hidden="true" />
    </Link>
  );
}

export default function AcademicPage() {
  return (
    <main id="main-content" className="bg-white pt-16 text-ink">
      <div className="page-container py-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Academic" },
          ]}
        />
      </div>

      <section className="page-container pb-16 pt-2">
        <h1 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold tracking-[-0.025em] text-ink">
          Academic Programs and Scholarships
        </h1>

        <div className="mt-20">
          <h2 className="text-2xl font-extrabold text-ink">Programs</h2>
          <div className="mx-auto mt-10 grid max-w-6xl gap-10 md:grid-cols-2">
            {academicPrograms.map((program) => (
              <article key={program.title} id={program.href.slice(1)}>
                <h3 className="text-2xl font-extrabold text-ink">
                  {program.title}
                </h3>
                <p className="mt-2 text-sm text-ink">{program.overview}</p>
                <p className="mt-4 text-sm text-ink">{program.info}</p>
                <LargeWireframeLink
                  href={program.href}
                  label="View Program Information"
                />
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-extrabold text-ink">Scholarships</h2>
          <div className="mt-6 grid gap-10 bg-[oklch(0.86_0_0)] px-8 py-12 md:grid-cols-2 md:px-24">
            {scholarships.map((scholarship) => (
              <article key={scholarship.title} id={scholarship.href.slice(1)}>
                <h3 className="text-2xl font-extrabold text-ink">
                  {scholarship.title}
                </h3>
                <p className="mt-2 text-sm text-ink">{scholarship.overview}</p>
                <p className="mt-4 text-sm text-ink">{scholarship.info}</p>
                <LargeWireframeLink
                  href={scholarship.href}
                  label="View Program Information"
                  tone="white"
                />
              </article>
            ))}
          </div>
        </div>

        <section className="mt-8 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-ink">
            Frequently Asked Questions (FAQs)
          </h2>
          <h3 className="mt-6 text-2xl font-extrabold text-ink">
            How to contact a potential supervisor?
          </h3>

          <ol className="mt-6 space-y-5">
            {supervisorSteps.map((step, index) => (
              <li key={step.title}>
                <h4 className="text-lg font-extrabold text-ink">
                  {index + 1}. {step.title}
                </h4>
                <p className="ml-6 mt-1 text-sm text-ink">{step.description}</p>
                {step.href ? (
                  <Link
                    href={step.href}
                    className="ml-6 mt-2 inline-flex min-h-8 items-center gap-2 rounded-md border border-ink px-3 text-xs font-bold text-ink hover:bg-[oklch(0.94_0_0)]"
                  >
                    {step.actionLabel}
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-28 max-w-2xl">
          <h2 className="text-2xl font-extrabold text-ink">
            Need more Information?
          </h2>
          <p className="mt-2 text-sm text-ink">
            For general academic program inquiries, contact the department / KBK.
          </p>
          <Link
            href="/#contact"
            className="mt-2 inline-flex min-h-8 items-center gap-2 rounded-md border border-ink px-3 text-xs font-bold text-ink hover:bg-[oklch(0.94_0_0)]"
          >
            Contact us
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </section>
      </section>
    </main>
  );
}
