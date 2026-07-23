"use client";

import ResearchDirectory from "@/modules/research/components/research-directory";
import { apiRequest, type ResearchSummary } from "@/lib/api";
import { LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function ResearchAreasPage() {
  const [research, setResearch] = useState<ResearchSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    apiRequest<ResearchSummary>("research", { signal: controller.signal })
      .then(setResearch)
      .catch((requestError: Error) => {
        if (!controller.signal.aborted) setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const items = useMemo(
    () =>
      research?.clusters.map((cluster) => ({
        slug: cluster.slug,
        title: cluster.name,
        description: cluster.description || undefined,
        tags: (cluster.tags || []).map((tag) => ({
          name: tag.name,
          slug: tag.slug,
        })),
        lecturers: cluster.lecturer_count || 0,
        publications: cluster.publication_count || 0,
      })) || [],
    [research],
  );

  if (loading) {
    return (
      <main id="main-content" className="grid min-h-screen place-items-center bg-white pt-20">
        <div className="flex items-center gap-3 text-dteti-blue" role="status">
          <LoaderCircle className="animate-spin" aria-hidden="true" />
          <span className="font-semibold">Loading research areas…</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main id="main-content" className="min-h-screen bg-white pb-20 pt-28">
        <div className="page-container bg-surface px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-dteti-blue">
            Research areas are temporarily unavailable
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <ResearchDirectory
      title="Research Areas"
      breadcrumbCurrent="Research Areas"
      searchPlaceholder="Search research area or topic"
      items={items}
    />
  );
}
