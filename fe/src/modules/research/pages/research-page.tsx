import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/global/breadcrumbs";
import WireframePlaceholder from "@/components/global/wireframe-placeholder";
import { researchLandingCards } from "@/modules/research/data/research.data";

function ResearchLandingCard({
  card,
}: {
  card: (typeof researchLandingCards)[number];
}) {
  return (
    <article>
      <h2 className="text-3xl font-extrabold tracking-[-0.025em] text-ink">
        {card.title}
      </h2>
      <p className="mt-3 text-base text-ink">{card.description}</p>
      <Link
        href={card.href}
        className="mt-7 flex min-h-16 items-center justify-between bg-[oklch(0.86_0_0)] px-14 text-2xl font-extrabold text-ink hover:bg-[oklch(0.8_0_0)]"
      >
        <span>{card.actionLabel}</span>
        <ArrowRight size={28} aria-hidden="true" />
      </Link>
    </article>
  );
}

export default function ResearchPage() {
  return (
    <main id="main-content" className="bg-white pt-16 text-ink sm:pt-20">
      <div className="page-container py-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Research" },
          ]}
        />
      </div>

      <section className="page-container pb-10 pt-2 text-center">
        <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold tracking-[-0.03em] text-ink">
          Research
        </h1>
        <p className="mt-5 text-lg text-ink">
          Explore research expertise and ongoing work across the research group.
        </p>
      </section>

      <WireframePlaceholder className="h-[min(42vw,32rem)] min-h-72 w-full" />

      <div className="-mt-5 flex justify-center gap-1.5" aria-hidden="true">
        <span className="size-3 rounded-full bg-ink" />
        <span className="size-3 rounded-full border-2 border-ink bg-white" />
        <span className="size-3 rounded-full border-2 border-ink bg-white" />
      </div>

      <section className="page-container grid gap-16 pb-24 pt-10 md:grid-cols-2">
        {researchLandingCards.map((card) => (
          <ResearchLandingCard key={card.title} card={card} />
        ))}
      </section>
    </main>
  );
}
