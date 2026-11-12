"use client";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import HeroSearch from "../components/hero-search";

export default function HeroSection() {
  const hero = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = hero.current;
    if (!element) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let currentHeight = element.getBoundingClientRect().height;
    let previousTime = 0;
    let velocity = 0;
    let collapsed = window.scrollY >= 90;

    const targetHeight = () => {
      const restingHeight = Math.min(
        640,
        Math.max(500, window.innerWidth * 0.445),
      );
      const fullHeight = Math.max(restingHeight, window.innerHeight);
      return collapsed ? restingHeight : fullHeight;
    };

    const syncScrollProgress = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / 320));
      element.style.setProperty("--hero-progress", progress.toFixed(4));
    };

    const animate = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
      previousTime = time;
      const target = targetHeight();
      // Small integration steps keep the spring stable on slower frames.
      const steps = Math.ceil(elapsed / 8);
      const delta = elapsed / steps / 1000;
      for (let step = 0; step < steps; step += 1) {
        velocity += ((target - currentHeight) * 180 - velocity * 23) * delta;
        currentHeight += velocity * delta;
      }
      const settled =
        Math.abs(target - currentHeight) < 0.25 && Math.abs(velocity) < 1;
      if (settled) {
        currentHeight = target;
        velocity = 0;
      }
      element.style.setProperty("--hero-height", `${currentHeight}px`);
      frame = settled ? 0 : window.requestAnimationFrame(animate);
    };

    const update = () => {
      syncScrollProgress();
      if (!desktop.matches || reducedMotion.matches) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        velocity = 0;
        element.style.removeProperty("--hero-height");
        return;
      }
      // Separate thresholds prevent repeated launches near the trigger.
      if (window.scrollY >= 90) collapsed = true;
      if (window.scrollY <= 12) collapsed = false;
      if (!frame) {
        previousTime = 0;
        frame = window.requestAnimationFrame(animate);
      }
    };

    syncScrollProgress();
    if (desktop.matches && !reducedMotion.matches) {
      currentHeight = targetHeight();
      element.style.setProperty("--hero-height", `${currentHeight}px`);
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    desktop.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      desktop.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
      window.cancelAnimationFrame(frame);
      element.style.removeProperty("--hero-height");
      element.style.removeProperty("--hero-progress");
    };
  }, []);

  function scrollToClusters() {
    const nextSection = document.getElementById("research-clusters-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.85, behavior: "smooth" });
    }
  }

  return (
    <section ref={hero} className="discovery-hero">
      <div className="discovery-hero-bg" aria-hidden="true" />
      <div className="discovery-hero-content">
        <h1>What do you want to discover?</h1>
        <HeroSearch />
      </div>
      <button
        type="button"
        onClick={scrollToClusters}
        className="discovery-hero-scroll-cue"
        aria-label="Scroll down to explore research clusters"
      >
        <span>Explore Research</span>
        <ChevronDown size={18} aria-hidden="true" />
      </button>
    </section>
  );
}
