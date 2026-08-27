"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import { apiRequest, getApiAssetUrl, type NewsArticle } from "@/lib/api";
import { ArrowLeft, ArrowUpRight, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

export default function NewsDetailPage({ slug }: { slug: string }) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    apiRequest<NewsArticle>(`content/news/slug/${encodeURIComponent(slug)}`, {
      signal: controller.signal,
    })
      .then((item) => {
        setArticle(item);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(requestError instanceof Error ? requestError.message : "The article could not be loaded.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [slug]);

  if (loading) {
    return (
      <main id="main-content" className="grid min-h-screen place-items-center bg-white pt-20" role="status">
        <div className="flex items-center gap-3 font-semibold text-dteti-blue">
          <LoaderCircle className="animate-spin" aria-hidden="true" /> Loading article…
        </div>
      </main>
    );
  }

  if (!article || error) {
    return (
      <main id="main-content" className="min-h-screen bg-white pt-24 text-ink sm:pt-28">
        <div className="page-container py-16 text-center">
          <h1 className="text-3xl font-extrabold text-dteti-blue">News article not found</h1>
          <p className="mt-3 text-sm text-muted">{error || "This article is no longer available."}</p>
          <Link href="/news" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg bg-dteti-yellow px-5 text-sm font-bold text-dteti-ink">
            <ArrowLeft size={17} aria-hidden="true" /> Back to News
          </Link>
        </div>
      </main>
    );
  }

  const image = getApiAssetUrl(article.media?.file_url || article.image_url);

  return (
    <main id="main-content" className="min-h-screen bg-white pb-20 pt-24 text-ink sm:pt-28">
      <div className="page-container">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Update", href: "/news" },
            { label: "News", href: "/news" },
            { label: article.title },
          ]}
        />

        <article className="mx-auto max-w-5xl pb-8 pt-9">
          <header className="mx-auto max-w-3xl text-center">
            <time dateTime={article.published_at} className="text-sm font-bold text-dteti-blue">
              {formatPublishedDate(article.published_at)}
            </time>
            <h1 className="mt-4 text-[clamp(2rem,4.5vw,3.75rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-dteti-blue-deep">
              {article.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">{article.excerpt}</p>
          </header>

          {image ? (
            <div className="relative mt-10 aspect-[16/8.5] overflow-hidden rounded-xl bg-surface-strong">
              <Image
                src={image}
                alt={article.media?.alt_text || article.title}
                fill
                priority
                sizes="(min-width: 1280px) 1024px, 100vw"
                className="object-cover"
                unoptimized={image.startsWith("http") || image.startsWith("/uploads/")}
              />
            </div>
          ) : null}

          <div className="mx-auto mt-10 max-w-3xl">
            {article.body ? (
              <div className="whitespace-pre-line text-base leading-8 text-ink">{article.body}</div>
            ) : (
              <p className="text-base leading-8 text-ink">{article.excerpt}</p>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <Link href="/news" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-dteti-blue hover:underline">
                <ArrowLeft size={17} aria-hidden="true" /> Back to News
              </Link>
              {article.link_url ? (
                <Link
                  href={article.link_url}
                  target={/^https?:\/\//.test(article.link_url) ? "_blank" : undefined}
                  rel={/^https?:\/\//.test(article.link_url) ? "noopener noreferrer" : undefined}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-dteti-yellow px-5 text-sm font-bold text-dteti-ink transition-colors hover:bg-dteti-yellow-soft"
                >
                  Open original source <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
