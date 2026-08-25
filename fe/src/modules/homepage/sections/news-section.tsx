import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/global/button";
import { getApiAssetUrl, type NewsArticle } from "@/lib/api";

export default function NewsSection({
  items,
  archiveUrl,
}: {
  items: NewsArticle[];
  archiveUrl?: string;
}) {
  return (
    <section id="news" className="section-space bg-white">
      <div className="page-container">
        <h2 className="text-center text-2xl font-extrabold text-dteti-blue">
          Latest News
        </h2>

        {items.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {items.map((item) => {
              const image = getApiAssetUrl(item.media?.file_url || item.image_url);

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-line bg-white transition-colors duration-200 hover:border-dteti-blue/45"
                >
                  {image ? (
                    <div className="relative h-52 bg-surface-strong">
                      <Image
                        src={image}
                        alt={item.media?.alt_text || item.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover grayscale"
                        unoptimized={image.startsWith("http") || image.startsWith("/uploads/")}
                      />
                    </div>
                  ) : null}
                  <div className="p-4">
                    <h3 className="text-base font-extrabold leading-5 text-dteti-blue">
                      <Link href={item.link_url || "#news"} className="hover:underline">
                        {item.title}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-4 text-xs leading-4 text-ink">
                      {item.excerpt}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mx-auto mt-8 max-w-xl border border-line bg-surface px-6 py-8 text-center text-sm text-muted">
            News and research updates will appear here when they are published.
          </p>
        )}

        {archiveUrl ? (
          <div className="mt-7 flex justify-center">
            <ButtonLink href={archiveUrl} variant="outline" size="sm">
              More News <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
