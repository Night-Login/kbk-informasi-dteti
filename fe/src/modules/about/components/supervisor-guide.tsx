import { ArrowRight } from "lucide-react";
import Link from "next/link";

type SupervisorStep = {
  title: string;
  description: string;
  action?: { label: string; href: string };
};

const steps: SupervisorStep[] = [
  {
    title: "Explore Research Areas",
    description: "Find a research topic related to your interests.",
    action: { label: "Explore Research Areas", href: "/research-areas" },
  },
  {
    title: "Find a Lecturer",
    description: "Review lecturer expertise and supervision status.",
    action: { label: "Browse Lecturers", href: "/people" },
  },
  {
    title: "Review the Lecturer Profile",
    description: "Read the lecturer's bio, research interests, and selected publications.",
  },
  {
    title: "Contact via Institutional Email",
    description: "Introduce yourself and explain your research interest.",
  },
];

export default function SupervisorGuide({ headingId }: { headingId: string }) {
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-2xl font-bold sm:text-[32px]">
        Frequently Asked Questions (FAQs)
      </h2>
      <h3 className="mt-5 text-xl font-bold sm:text-2xl">How to contact a potential supervisor?</h3>
      <ol className="mt-6 space-y-4 pl-6">
        {steps.map((step) => (
          <li key={step.title} className="list-decimal pl-1">
            <h4 className="text-base font-semibold sm:text-xl">{step.title}</h4>
            <p className="mt-1 text-sm leading-6 sm:text-base">{step.description}</p>
            {step.action ? (
              <Link
                href={step.action.href}
                className="mt-2 inline-flex min-h-9 items-center gap-1 rounded-lg border border-[#151729] px-4 text-sm font-medium transition-colors hover:bg-[#151729] hover:text-white"
              >
                {step.action.label}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
