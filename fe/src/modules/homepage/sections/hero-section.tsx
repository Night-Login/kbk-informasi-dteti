"use client";
import HeroSearch from "../components/hero-search";

export default function HeroSection({ backgroundImage }: { backgroundImage?: string | null }) {
  const style = backgroundImage
    ? {
        background: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.55)), url('${backgroundImage}') center/cover no-repeat`,
      }
    : undefined;

  return (
    <section className="discovery-hero" style={style}>
      <div className="discovery-hero-content">
        <h1>What do you want to discover?</h1>
        <HeroSearch />
      </div>
    </section>
  );
}
