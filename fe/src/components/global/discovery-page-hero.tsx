import Image from "next/image";

type DiscoveryPageHeroProps = {
  title: string;
  imageSrc: string;
};

export default function DiscoveryPageHero({ title, imageSrc }: DiscoveryPageHeroProps) {
  return (
    <section className="relative flex h-[300px] items-end justify-center overflow-hidden pb-14 text-white sm:h-[380px] sm:pb-16">
      <Image src={imageSrc} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/8" aria-hidden="true" />
      <h1 className="relative text-3xl font-bold sm:text-[40px]">{title}</h1>
    </section>
  );
}
