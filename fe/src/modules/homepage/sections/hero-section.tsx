import Image from "next/image";
import { getApiAssetUrl } from "@/lib/api";

export default function HeroSection({
  settings = {},
}: {
  settings?: Record<string, string>;
}) {
  const title = settings.home_hero_title || "Profil Kelompok Keahlian DTETI";
  const image = getApiAssetUrl(settings.home_hero_image) || "/images/pakdn.jpeg";
  const description = settings.home_hero_description ||
    "Website ini merupakan platform profil resmi Kelompok Keahlian DTETI yang berfungsi sebagai pusat informasi dosen, bidang riset, publikasi, proyek, kegiatan akademik, dan peluang kolaborasi.";

  return (
    <section className="relative mt-16 min-h-[520px] overflow-hidden bg-white sm:mt-20">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover object-center"
        priority
        unoptimized={image.startsWith("http") || image.startsWith("/uploads/")}
      />
      <div className="absolute inset-0 bg-black/20" />

      <div className="page-container relative z-10 flex min-h-[520px] items-end pb-8">
        <div className="w-full">
          <h1 className="w-fit max-w-full border-b-4 border-dteti-yellow bg-dteti-blue px-6 py-4 text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-tight tracking-[-0.025em] text-dteti-yellow text-balance">
            {title}
          </h1>
          <p className="brand-gradient max-w-full border-t-2 border-dteti-yellow px-6 py-4 text-base leading-6 text-white/95">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
