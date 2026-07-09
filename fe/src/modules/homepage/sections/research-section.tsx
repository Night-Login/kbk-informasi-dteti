import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/global/button";
import { researchAreas } from "@/modules/homepage/data/home.data";

function ResearchCard({
  item,
}: {
  item: (typeof researchAreas)[number];
}) {
  return (
    <Link
      href="#research"
      className="group relative min-h-24 overflow-hidden rounded-xl bg-white"
    >
      <Image
        src={item.image}
        alt=""
        fill
        sizes="(min-width: 1024px) 320px, 100vw"
        className="object-cover grayscale transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <span className="absolute inset-x-0 bottom-0 bg-white/88 px-2 py-1.5 text-sm font-extrabold text-ink">
        {item.title}
      </span>
    </Link>
  );
}

export default function ResearchSection() {
  return (
    <section id="research" className="section-space bg-[oklch(0.79_0_0)]">
      <div className="page-container grid gap-12 lg:grid-cols-[0.8fr_1.35fr] lg:items-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink">
            Highlight Research Areas
          </h2>
          <p className="mt-5 text-sm leading-5 text-ink">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque fringilla nisl elit, sit amet fermentum nisi consequat
            et. Nam sit amet metus in sem mollis hendrerit eget nec tellus.
            Vestibulum semper fringilla libero, et condimentum libero venenatis
            vitae.
          </p>
          <div className="mt-7 flex flex-col items-start gap-4">
            <ButtonLink href="#research" variant="outline" size="sm">
              More Research <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/people" variant="outline" size="sm">
              Find Lecturer <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-5">
            {researchAreas.slice(0, 3).map((item) => (
              <ResearchCard key={item.title} item={item} />
            ))}
          </div>
          <div className="grid content-start gap-5 sm:pt-12">
            {researchAreas.slice(3).map((item) => (
              <ResearchCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
