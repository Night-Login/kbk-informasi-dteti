"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/global/button";
import { apiRequest, type ResearchCluster, type ResearchSummary } from "@/lib/api";
import { useEffect, useState } from "react";

const researchImages = [
  "/images/news-chip.jpg",
  "/images/news-network.jpg",
  "/images/news-students.jpg",
  "/images/hero-campus.jpg",
] as const;

function ResearchCard({
  item,
  index,
}: {
  item: ResearchCluster;
  index: number;
}) {
  const firstTag = item.tags?.[0];
  return (
    <Link
      href={
        firstTag
          ? `/tag-research-areas/${firstTag.slug}`
          : `/research-areas?cluster=${item.slug}`
      }
      className="group relative min-h-28 overflow-hidden rounded-xl bg-white"
    >
      <Image
        src={researchImages[index % researchImages.length]}
        alt=""
        fill
        sizes="(min-width: 1024px) 320px, 100vw"
        className="object-cover grayscale transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <span className="absolute inset-x-0 bottom-0 bg-white/95 px-3 py-2 text-sm font-extrabold text-dteti-ink">
        {item.name}
      </span>
    </Link>
  );
}

export default function ResearchSection() {
  const [research, setResearch] = useState<ResearchSummary | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    apiRequest<ResearchSummary>("research", { signal: controller.signal })
      .then(setResearch)
      .catch(() => {
        if (!controller.signal.aborted) setResearch(null);
      });
    return () => controller.abort();
  }, []);

  const researchAreas = research?.clusters.slice(0, 6) || [];

  return (
    <section id="research" className="brand-gradient section-space">
      <div className="page-container grid gap-12 lg:grid-cols-[0.8fr_1.35fr] lg:items-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-dteti-yellow">
            Highlight Research Areas
          </h2>
          <p className="mt-5 text-sm leading-6 text-white/90">
            Explore the group&apos;s research clusters, find lecturers working on
            related topics, and follow their projects and publications.
          </p>
          {research ? (
            <p className="mt-4 text-sm font-semibold text-white">
              {research.summary.total_clusters} clusters · {research.summary.active_tags} active topics ·{" "}
              {research.summary.total_lecturers || 0} lecturers
            </p>
          ) : null}
          <div className="mt-7 flex flex-col items-start gap-4">
            <ButtonLink href="/research-areas" variant="outline" size="sm">
              More Research <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/people" variant="outline" size="sm">
              Find Lecturer <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>

        {researchAreas.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-5">
              {researchAreas
                .filter((_, index) => index % 2 === 0)
                .map((item, index) => (
                  <ResearchCard key={item.id} item={item} index={index * 2} />
                ))}
            </div>
            <div className="grid content-start gap-5 sm:pt-12">
              {researchAreas
                .filter((_, index) => index % 2 === 1)
                .map((item, index) => (
                  <ResearchCard key={item.id} item={item} index={index * 2 + 1} />
                ))}
            </div>
          </div>
        ) : (
          <div className="border border-white/35 px-7 py-10 text-white">
            <p className="font-semibold">Research data will appear here once the API is available.</p>
          </div>
        )}
      </div>
    </section>
  );
}
