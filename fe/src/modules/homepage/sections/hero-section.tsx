import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative mt-16 min-h-[520px] overflow-hidden bg-surface">
      <Image
        src="/images/hero-campus.jpg"
        alt="Ilustrasi area kampus untuk profil Kelompok Keahlian DTETI"
        fill
        priority
        sizes="100vw"
        className="object-cover grayscale"
      />
      <div className="absolute inset-0 bg-white/18" />

      <div className="page-container relative z-10 flex min-h-[520px] items-end pb-8">
        <div className="w-full">
          <h1 className="w-fit bg-surface-strong px-6 py-4 text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-tight tracking-[-0.025em] text-ink text-balance">
            Profil Kelompok Keahlian DTETI
          </h1>
          <p className="bg-[oklch(0.76_0_0)] px-6 py-4 text-base leading-6 text-ink">
            Website ini merupakan platform profil resmi Kelompok Keahlian DTETI
            yang berfungsi sebagai pusat informasi dosen, bidang riset,
            publikasi, proyek, kegiatan akademik, dan peluang kolaborasi.
            Website dirancang agar pihak eksternal dapat memahami kapasitas
            kelompok riset secara cepat melalui pendekatan berbasis topik
            penelitian.
          </p>
        </div>
      </div>
    </section>
  );
}
