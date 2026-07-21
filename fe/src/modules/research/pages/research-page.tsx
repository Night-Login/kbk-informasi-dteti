import Breadcrumbs from "@/components/global/breadcrumbs";
import WireframePlaceholder from "@/components/global/wireframe-placeholder";
import { researchLandingCards } from "@/modules/research/data/research.data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function ResearchLandingCard({
  card,
  featured = false,
}: {
  card: (typeof researchLandingCards)[number];
  featured?: boolean;
}) {
  return (
    <article
      className={featured ? "w-full md:col-span-2 md:max-w-3xl md:justify-self-center" : ""}
    >
      <h2 className="text-2xl font-bold text-dteti-blue sm:text-3xl">
        {card.title}
      </h2>
      <p className="mt-2 max-w-2xl text-base leading-7 text-ink">
        {card.description}
      </p>
      <Link
        href={card.href}
        className="mt-6 flex min-h-16 items-center justify-between bg-dteti-yellow px-7 text-lg font-bold text-dteti-ink transition-colors hover:bg-dteti-yellow/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 sm:px-12 sm:text-xl"
      >
        <span>{card.actionLabel}</span>
        <ArrowRight size={24} aria-hidden="true" />
      </Link>
    </article>
  );
}

export default function ResearchPage() {
  return (
    <main id="main-content" className="bg-white pb-20 pt-24 text-ink sm:pt-28">
      <div className="page-container">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Research" }]} />
      </div>

      <section className="page-container pb-12 pt-7 text-center">
        <h1 className="text-4xl font-bold tracking-[-0.025em] text-dteti-blue sm:text-5xl">
          Research
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-ink sm:text-lg">
          Explore research expertise and ongoing work across the research group.
        </p>
      </section>

      <section aria-label="Featured research" className="relative">
        <WireframePlaceholder className="h-[clamp(20rem,39vw,34rem)] w-full" />
        <div
          className="absolute inset-x-0 bottom-5 flex justify-center gap-1.5"
          aria-hidden="true"
        >
          <span className="size-3 rounded-full bg-ink" />
          <span className="size-3 rounded-full border-2 border-ink bg-white" />
          <span className="size-3 rounded-full border-2 border-ink bg-white" />
        </div>
      </section>

      <section className="page-container grid gap-x-14 gap-y-12 pb-8 pt-12 md:grid-cols-2">
        {researchLandingCards.map((card, index) => (
          <ResearchLandingCard key={card.title} card={card} featured={index === 0} />
        ))}
      </section>
    </main>
  );
}
