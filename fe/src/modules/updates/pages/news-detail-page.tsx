"use client";

import DiscoveryPageHero from "@/components/global/discovery-page-hero";
import { apiRequest, getApiAssetUrl, type NewsArticle } from "@/lib/api";
import { ArrowLeft, ArrowUpRight, LoaderCircle, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function formatPublishedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to be announced";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

const actionButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded border border-[#151729] bg-white px-5 text-sm font-semibold text-[#151729] transition-colors hover:bg-[#151729] hover:text-white";

export default function NewsDetailPage({ slug }: { slug: string }) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState("");

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
          setError(
            requestError instanceof Error
              ? requestError.message
              : "The article could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [slug]);

  async function handleShare() {
    if (!article) return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareMessage("Link copied to clipboard");
      }
    } catch (shareError) {
      if (
        !(shareError instanceof DOMException && shareError.name === "AbortError")
      ) {
        setShareMessage("Could not share link.");
      }
    }
  }

  if (loading) {
    return (
      <main
        id="main-content"
        className="discovery-page min-h-screen bg-white text-[#151729]"
      >
        <DiscoveryPageHero title="News" />
        <div className="grid min-h-80 place-items-center" role="status">
          <div className="flex items-center gap-3">
            <LoaderCircle className="animate-spin" aria-hidden="true" />
            <span>Loading article…</span>
          </div>
        </div>
      </main>
    );
  }

  if (!article || error) {
    return (
      <main
        id="main-content"
        className="discovery-page min-h-screen bg-white text-[#151729]"
      >
        <DiscoveryPageHero title="News" />
        <div className="discovery-container py-14">
          <div className="mx-auto max-w-3xl bg-[#d9d9d9] px-6 py-14 text-center">
            <h2 className="text-2xl font-semibold">News article not found</h2>
            <p className="mt-3 text-sm text-[#4f5054]">
              {error || "This article is no longer available."}
            </p>
            <Link href="/news" className={`${actionButtonClass} mt-7`}>
              <ArrowLeft size={17} aria-hidden="true" />
              <span>Back to News</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const image = getApiAssetUrl(article.media?.file_url || article.image_url);

  return (
    <main
      id="main-content"
      className="discovery-page min-h-screen bg-white text-[#151729]"
    >
      <DiscoveryPageHero title="News" />

      <div className="discovery-container py-10 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <Link href="/news" className={actionButtonClass}>
            <ArrowLeft size={17} aria-hidden="true" />
            <span>Back to News</span>
          </Link>

          <article className="mt-6">
            <header className="rounded-lg bg-[#d9d9d9] p-6 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="discovery-tag">DTETI UGM</span>
                  <time
                    dateTime={article.published_at}
                    className="text-xs font-medium text-[#44454b]"
                  >
                    {formatPublishedDate(article.published_at)}
                  </time>
                </div>

                <button
                  type="button"
                  onClick={handleShare}
                  className="discovery-icon-button"
                  aria-label={`Share ${article.title}`}
                  title="Share article"
                >
                  <Share2 size={18} aria-hidden="true" />
                </button>
              </div>

              {shareMessage && (
                <p role="status" className="mt-2 text-xs text-[#44454b]">
                  {shareMessage}
                </p>
              )}

              <h2 className="mt-4 text-2xl font-bold leading-tight text-[#151729] sm:text-4xl">
                {article.title}
              </h2>

              <p className="mt-4 max-w-3xl text-base leading-7 text-[#3f4045] sm:text-lg">
                {article.excerpt}
              </p>

              {image && (
                <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded bg-[#ececec]">
                  <Image
                    src={image}
                    alt={article.media?.alt_text || article.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 896px, 90vw"
                    className="object-cover"
                    unoptimized={
                      image.startsWith("http") || image.startsWith("/uploads/")
                    }
                  />
                </div>
              )}
            </header>

            <div className="mt-8 space-y-6 text-base leading-8 text-[#202124] sm:text-lg">
              {article.body ? (
                <div className="whitespace-pre-line">{article.body}</div>
              ) : (
                <p>{article.excerpt}</p>
              )}
            </div>

            <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#d9d9d9] pt-6">
              <Link href="/news" className={actionButtonClass}>
                <ArrowLeft size={17} aria-hidden="true" />
                <span>Back to News</span>
              </Link>

              {article.link_url ? (
                <Link
                  href={article.link_url}
                  target={
                    /^https?:\/\//.test(article.link_url) ? "_blank" : undefined
                  }
                  rel={
                    /^https?:\/\//.test(article.link_url)
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className={actionButtonClass}
                >
                  <span>Open original source</span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              ) : null}
            </footer>
          </article>
        </div>
      </div>
    </main>
  );
}
