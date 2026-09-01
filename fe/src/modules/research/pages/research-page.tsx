"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import { apiRequest, getApiAssetUrl, type ResearchCluster, type ResearchSummary } from "@/lib/api";
import { researchLandingCards } from "@/modules/research/data/research.data";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
  const [clusters, setClusters] = useState<ResearchCluster[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    apiRequest<ResearchSummary>("research", { signal: controller.signal })
      .then((result) => {
        setClusters(result.clusters || []);
        setSettings(result.settings || {});
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setClusters([]);
          setSettings({});
        }
      });

    return () => controller.abort();
  }, []);

  const researchSlides = useMemo(() => clusters
    .map((cluster) => ({
      cluster,
      image: getApiAssetUrl(cluster.media?.file_url || cluster.image_url),
    }))
    .filter((slide): slide is { cluster: ResearchCluster; image: string } => Boolean(slide.image)), [clusters]);
  const selectedSlideIndex = researchSlides.length > 0
    ? Math.min(activeSlide, researchSlides.length - 1)
    : 0;
  const selectedSlide = researchSlides[selectedSlideIndex];

  const showPrevious = () => {
    setActiveSlide((current) =>
      researchSlides.length > 0 ? (current - 1 + researchSlides.length) % researchSlides.length : 0,
    );
  };

  const showNext = () => {
    setActiveSlide((current) =>
      researchSlides.length > 0 ? (current + 1) % researchSlides.length : 0,
    );
  };

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

      <section aria-label="Featured research" className="relative overflow-hidden bg-dteti-blue-deep">
        {selectedSlide ? (
          <>
            <div className="relative h-[clamp(20rem,39vw,34rem)] w-full">
              <Image
                src={selectedSlide.image}
                alt={selectedSlide.cluster.name}
                fill
                priority
                sizes="100vw"
                className="object-cover"
                unoptimized={selectedSlide.image.startsWith("http") || selectedSlide.image.startsWith("/uploads/")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dteti-blue-deep/90 via-dteti-blue-deep/10 to-transparent" />
              <div className="page-container absolute inset-x-0 bottom-0 pb-10 text-left text-white sm:pb-12">
                <h2 className="max-w-3xl text-2xl font-extrabold text-white sm:text-4xl">
                  {selectedSlide.cluster.name}
                </h2>
                {selectedSlide.cluster.description ? (
                  <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
                    {selectedSlide.cluster.description}
                  </p>
                ) : null}
              </div>
            </div>

            {researchSlides.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Previous research image"
                  className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-dteti-blue-deep transition-colors hover:bg-dteti-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dteti-yellow sm:left-8"
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next research image"
                  className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-dteti-blue-deep transition-colors hover:bg-dteti-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dteti-yellow sm:right-8"
                >
                  <ChevronRight aria-hidden="true" />
                </button>
                <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2" aria-label="Choose research image">
                  {researchSlides.map((slide, index) => (
                    <button
                      type="button"
                      key={slide.cluster.id}
                      onClick={() => setActiveSlide(index)}
                      aria-label={`Show ${slide.cluster.name}`}
                      aria-current={index === selectedSlideIndex ? "true" : undefined}
                      className={`size-3 rounded-full border-2 border-white transition-colors ${
                        index === selectedSlideIndex ? "bg-dteti-yellow" : "bg-dteti-blue-deep/50 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </>
        ) : settings.research_featured_image ? (
          <div className="relative h-[clamp(20rem,39vw,34rem)] w-full">
            <Image
              src={getApiAssetUrl(settings.research_featured_image) || settings.research_featured_image}
              alt="Research at DTETI"
              fill
              priority
              sizes="100vw"
              className="object-cover"
              unoptimized={settings.research_featured_image.startsWith("http") || settings.research_featured_image.startsWith("/uploads/")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dteti-blue-deep/90 via-dteti-blue-deep/10 to-transparent" />
            <div className="page-container absolute inset-x-0 bottom-0 pb-10 text-center text-white sm:pb-12">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Research at DTETI</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/90">
                Explore research clusters, expertise, and active work across the Information Engineering Research Group.
              </p>
            </div>
          </div>
        ) : (
          <div className="brand-gradient grid h-[clamp(20rem,39vw,34rem)] place-items-center px-6 text-center text-white">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Research at DTETI</h2>
              <p className="mt-4 text-base leading-7 text-white/90">
                Explore research clusters, expertise, and active work across the Information Engineering Research Group.
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="page-container grid gap-x-14 gap-y-12 pb-8 pt-12 md:grid-cols-2">
        {researchLandingCards.map((card, index) => (
          <ResearchLandingCard key={card.title} card={card} featured={index === 0} />
        ))}
      </section>
    </main>
  );
}
