import Breadcrumbs from "@/components/global/breadcrumbs";
import { supervisorSteps } from "@/modules/academic/data/academic.data";
import { ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function FaqPage() {
  return (
    <main id="main-content" className="min-h-screen bg-white pb-20 pt-24 text-ink sm:pt-28">
      <div className="page-container">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />

        <section className="mx-auto max-w-5xl pb-8 pt-9">
          <header className="mx-auto max-w-3xl text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-dteti-blue-soft text-dteti-blue">
              <HelpCircle size={24} aria-hidden="true" />
            </div>
            <h1 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.025em] text-dteti-blue">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted">
              Practical guidance for prospective students and researchers who want to connect
              with DTETI supervisors.
            </p>
          </header>

          <section className="mt-12 rounded-2xl border border-line bg-surface p-6 shadow-xs sm:p-10" aria-labelledby="supervisor-faq">
            <h2 id="supervisor-faq" className="text-xl font-extrabold text-dteti-blue-deep sm:text-2xl">
              How do I contact a potential supervisor?
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Follow these steps before sending your first message.
            </p>

            <ol className="mt-7 grid gap-4 md:grid-cols-2">
              {supervisorSteps.map((step, index) => (
                <li key={step.title} className="flex h-full flex-col rounded-xl border border-line/70 bg-white p-5 shadow-xs">
                  <span className="grid size-8 place-items-center rounded-full bg-dteti-yellow text-sm font-extrabold text-dteti-ink">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-base font-extrabold text-ink sm:text-lg">{step.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-ink/80">{step.description}</p>
                  {step.href ? (
                    <Link
                      href={step.href}
                      className="mt-5 inline-flex min-h-10 items-center gap-2 self-start rounded-lg border border-line bg-surface px-4 text-xs font-bold text-dteti-blue transition-colors hover:border-dteti-blue hover:bg-dteti-blue-soft/30"
                    >
                      {step.actionLabel}
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        </section>
      </div>
    </main>
  );
}
