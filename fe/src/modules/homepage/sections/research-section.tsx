"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { apiRequest, type ResearchSummary } from "@/lib/api";
const initialClusters = [
  { name: "Intelligent Systems & Data", slug: "intelligent-systems-data" },
  { name: "Networks, Security & Infrastructure", slug: "networks-security-infrastructure" },
  { name: "IoT, Smart Systems & Environment", slug: "iot-smart-systems-environment" },
];
export default function ResearchSection() {
  const [clusters, setClusters] = useState(initialClusters);
  const [loaded, setLoaded] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    apiRequest<ResearchSummary>("research", { signal: controller.signal }).then((data) => {
      if (data.clusters.length) { setClusters(data.clusters); setLoaded(true); }
    }).catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => {
    const element = viewport.current;
    const group = track.current?.firstElementChild as HTMLElement | null;
    if (!element || !group) return;
    const mobile = window.matchMedia("(max-width: 700px), (pointer: coarse)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let hovered = element.matches(":hover");
    let position = element.scrollLeft;
    let lastAppliedPosition = element.scrollLeft;
    let visible = false;
    let previousTime = 0;
    let frame = 0;
    const move = (distance: number) => {
      const width = group.offsetWidth;
      if (!width) return;
      if (element.scrollLeft !== lastAppliedPosition) position = element.scrollLeft;
      // Keep fractional movement: browsers may round scrollLeft on every frame.
      position = ((position + distance) % width + width) % width;
      element.scrollLeft = position;
      lastAppliedPosition = element.scrollLeft;
    };
    const onWheel = (event: WheelEvent) => {
      if (mobile.matches || event.ctrlKey || element.scrollWidth <= element.clientWidth) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (!delta) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1;
      event.preventDefault();
      if (reducedMotion.matches) element.scrollLeft += delta * unit;
      else move(delta * unit);
    };
    const tick = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 0;
      previousTime = time;
      const keyboardFocused = element.matches(":focus-visible") || !!element.querySelector(":focus-visible");
      if (visible && !document.hidden && !mobile.matches && !reducedMotion.matches && !hovered && !keyboardFocused) {
        move(group.offsetWidth * elapsed / 40000);
      }
      frame = window.requestAnimationFrame(tick);
    };
    const onEnter = () => { hovered = true; };
    const onLeave = () => { hovered = false; };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(element);
    element.addEventListener("wheel", onWheel, { passive: false });
    element.addEventListener("mouseenter", onEnter);
    element.addEventListener("mouseleave", onLeave);
    frame = window.requestAnimationFrame(tick);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      element.removeEventListener("wheel", onWheel);
      element.removeEventListener("mouseenter", onEnter);
      element.removeEventListener("mouseleave", onLeave);
    };
  }, [clusters]);
  return <section className="discovery-clusters" aria-label="Research clusters">
    <div ref={viewport} className="discovery-marquee-window" tabIndex={0} role="region" aria-label="Research clusters, scroll horizontally to explore"><div ref={track} className="discovery-marquee-track">
      {[0, 1].map((copy) => <div key={copy} className="discovery-marquee-group" aria-hidden={copy === 1 ? true : undefined}>
        {clusters.map((cluster) => <Link key={cluster.slug} href={loaded ? `/research-areas#cluster-${encodeURIComponent(cluster.slug)}` : "/research-areas"} className="discovery-cluster" tabIndex={copy === 1 ? -1 : undefined}>{cluster.name}</Link>)}
      </div>)}
    </div></div>
  </section>;
}
