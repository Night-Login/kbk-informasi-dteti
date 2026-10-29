import Image from "next/image";

type DiscoveryPageHeroProps = {
  title: string;
};

export default function DiscoveryPageHero({ title }: DiscoveryPageHeroProps) {
  return (
    <section className="relative flex h-[300px] items-end justify-center overflow-hidden pb-14 text-white sm:h-[380px] sm:pb-16">
      <Image src="/images/hero-campus.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="hero-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
      <h1 className="relative text-3xl font-bold sm:text-[40px]">{title}</h1>
    </section>
  );
}
