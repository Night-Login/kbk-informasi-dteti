import Image from "next/image";

type PeopleHeroProps = {
  title?: string;
};

export default function PeopleHero({ title = "People" }: PeopleHeroProps) {
  return (
    <section className="relative flex h-[300px] items-end justify-center overflow-hidden pb-14 text-white sm:h-[380px] sm:pb-16">
      <Image
        src="/images/people-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/8" aria-hidden="true" />
      <h1 className="relative text-3xl font-bold sm:text-[40px]">{title}</h1>
    </section>
  );
}
