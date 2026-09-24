"use client";
import { Pause, Play } from "lucide-react";
import { useState } from "react";
export default function HeroSection() {
  const [paused, setPaused] = useState(false);
  return <section className={`discovery-hero ${paused ? "is-paused" : ""}`}>
    <div className="discovery-hero-content">
      <h1>What do you want to discover?</h1>
      <button className="discovery-search-trigger" onClick={() => window.dispatchEvent(new Event("discovery:open-search"))} aria-label="Explore research, people, projects — open search">
        <span className="discovery-search-static">Explore research, people, projects...</span>
        <span className="discovery-search-animation" aria-hidden="true"><span>Explore research, people, projects...</span><span>Explore research...</span><span>Explore people...</span><span>Explore projects...</span></span>
      </button>
    </div>
    <button className="discovery-motion-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? "Play hero animation" : "Pause hero animation"} aria-pressed={paused}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>
  </section>;
}
