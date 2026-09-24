"use client";
import { Pause, Play } from "lucide-react";
import { useState } from "react";
import HeroSearch from "../components/hero-search";
export default function HeroSection() {
  const [paused, setPaused] = useState(false);
  return <section className={`discovery-hero ${paused ? "is-paused" : ""}`}>
    <div className="discovery-hero-content">
      <h1>What do you want to discover?</h1>
      <HeroSearch />
    </div>
    <button className="discovery-motion-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? "Play hero animation" : "Pause hero animation"} aria-pressed={paused}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>
  </section>;
}
