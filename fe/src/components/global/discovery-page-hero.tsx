import Image from "next/image";

type DiscoveryPageHeroProps = {
  title: string;
  imageSrc?: string;
};

export default function DiscoveryPageHero({
  title,
  imageSrc = "/images/hero-campus.jpg",
}: DiscoveryPageHeroProps) {
  return (
    <section className="relative flex h-[300px] items-end justify-center overflow-hidden pb-14 text-white sm:h-[380px] sm:pb-16">
      <Image src={imageSrc} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="hero-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
      <h1 className="relative z-10 text-3xl font-bold sm:text-[40px]">{title}</h1>
    </section>
  );
}
