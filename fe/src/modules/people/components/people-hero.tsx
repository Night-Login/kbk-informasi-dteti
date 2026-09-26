import DiscoveryPageHero from "@/components/global/discovery-page-hero";

type PeopleHeroProps = {
  title?: string;
};

export default function PeopleHero({ title = "People" }: PeopleHeroProps) {
  return <DiscoveryPageHero title={title} imageSrc="/images/people-hero.png" />;
}
