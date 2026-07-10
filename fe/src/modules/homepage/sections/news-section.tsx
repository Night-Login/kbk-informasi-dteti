import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/global/button";
import { newsItems } from "@/modules/homepage/data/home.data";

export default function NewsSection() {
  return (
    <section id="news" className="section-space bg-white">
      <div className="page-container">
        <h2 className="text-center text-2xl font-extrabold text-ugm-blue">
          Latest News
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {newsItems.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className="overflow-hidden rounded-xl border border-line bg-white transition-colors duration-200 hover:border-ugm-blue/45"
            >
              <div className="relative h-52 bg-surface-strong">
                <Image
                  src={item.image}
                  alt="Ilustrasi gambar berita"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover grayscale"
                />
              </div>
              <div className="p-4">
                <h3 className="text-base font-extrabold leading-5 text-ink">
                  <Link href="#news" className="hover:text-ugm-blue hover:underline">
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-3 line-clamp-4 text-xs leading-4 text-ink">
                  {item.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 flex justify-center">
          <ButtonLink href="#news" variant="outline" size="sm">
            More News <ArrowRight size={16} aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
