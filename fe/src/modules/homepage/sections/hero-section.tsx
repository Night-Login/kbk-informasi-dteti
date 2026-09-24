"use client";
import HeroSearch from "../components/hero-search";
export default function HeroSection() {
  return <section className="discovery-hero">
    <div className="discovery-hero-content">
      <h1>What do you want to discover?</h1>
      <HeroSearch />
    </div>
  </section>;
}
