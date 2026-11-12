"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  apiRequest,
  type ResearchCluster,
  type ResearchSummary,
} from "@/lib/api";

const HOVER_DELAY_MS = 400;
const CLOSE_DELAY_MS = 180;

const initialClusters: ResearchCluster[] = [
  {
    id: "cluster-isd",
    name: "Intelligent System and Data",
    slug: "intelligent-systems-data",
    tags: [
      { id: "t-ml", name: "Machine Learning", slug: "machine-learning", lecturer_count: 0 },
      { id: "t-dl", name: "Deep Learning", slug: "deep-learning", lecturer_count: 0 },
      { id: "t-dm", name: "Data Mining", slug: "data-mining", lecturer_count: 0 },
      { id: "t-cv", name: "Computer Vision", slug: "computer-vision", lecturer_count: 0 },
      { id: "t-nlp", name: "NLP", slug: "nlp", lecturer_count: 0 },
      { id: "t-ai", name: "Artificial Intelligence", slug: "artificial-intelligence", lecturer_count: 0 },
    ],
  },
  {
    id: "cluster-nsi",
    name: "Networks, Security, and Infrastructure",
    slug: "networks-security-infrastructure",
    tags: [
      { id: "t-cn", name: "Computer Networks", slug: "computer-networks", lecturer_count: 0 },
      { id: "t-cs", name: "Cybersecurity", slug: "cybersecurity", lecturer_count: 0 },
      { id: "t-df", name: "Digital Forensics", slug: "digital-forensics", lecturer_count: 0 },
      { id: "t-bc", name: "Blockchain", slug: "blockchain", lecturer_count: 0 },
    ],
  },
  {
    id: "cluster-iot",
    name: "IoT, Smart Systems, and Environment",
    slug: "iot-smartsystem-environtment",
    tags: [
      { id: "t-iot", name: "IoT", slug: "iot", lecturer_count: 0 },
      { id: "t-sc", name: "Smart City", slug: "smart-city", lecturer_count: 0 },
      { id: "t-cac", name: "Context-Aware Computing", slug: "context-aware-computing", lecturer_count: 0 },
      { id: "t-auto", name: "Automation", slug: "automation", lecturer_count: 0 },
    ],
  },
  {
    id: "cluster-sdis",
    name: "Software, Data, and Information Systems",
    slug: "software-data-informationsystem",
    tags: [
      { id: "t-se", name: "Software Engineering", slug: "software-engineering", lecturer_count: 0 },
      { id: "t-web", name: "Website", slug: "website", lecturer_count: 0 },
      { id: "t-mob", name: "Mobile App", slug: "mobile-app", lecturer_count: 0 },
      { id: "t-db", name: "Database", slug: "database", lecturer_count: 0 },
    ],
  },
  {
    id: "cluster-hcce",
    name: "Human-Centered Computing and Education",
    slug: "humancenteredcomputing-education",
    tags: [
      { id: "t-hci", name: "Human-Computer Interaction", slug: "human-computer-interaction", lecturer_count: 0 },
      { id: "t-ui", name: "UI", slug: "ui", lecturer_count: 0 },
      { id: "t-ux", name: "UX", slug: "ux", lecturer_count: 0 },
      { id: "t-el", name: "E-Learning", slug: "e-learning", lecturer_count: 0 },
      { id: "t-it", name: "Immersive Technology", slug: "immersive-technology", lecturer_count: 0 },
    ],
  },
];

export default function ResearchSection() {
  const [clusters, setClusters] = useState<ResearchCluster[]>(initialClusters);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [popupLeft, setPopupLeft] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const marqueePaused = useRef(false);
  const pauseTimer = useRef<number | null>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const popupHovered = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    apiRequest<ResearchSummary>("research", { signal: controller.signal })
      .then((data) => {
        if (data.clusters.length) {
          setClusters(
            data.clusters.map((cluster, idx) => {
              const fallback =
                initialClusters.find((item) => item.slug === cluster.slug) ||
                initialClusters[idx % initialClusters.length];
              return {
                ...fallback,
                ...cluster,
                tags:
                  cluster.tags && cluster.tags.length > 0
                    ? cluster.tags
                    : fallback.tags,
              };
            }),
          );
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const element = viewport.current;
    const group = track.current?.firstElementChild as HTMLElement | null;
    if (!element || !group) return;
    const mobile = window.matchMedia("(max-width: 700px), (pointer: coarse)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let position = element.scrollLeft;
    let lastAppliedPosition = element.scrollLeft;
    let visible = false;
    let previousTime = 0;
    let frame = 0;

    const move = (distance: number) => {
      const width = group.offsetWidth;
      if (!width) return;
      if (element.scrollLeft !== lastAppliedPosition)
        position = element.scrollLeft;
      // Keep fractional movement: browsers may round scrollLeft on every frame.
      position = (((position + distance) % width) + width) % width;
      element.scrollLeft = position;
      lastAppliedPosition = element.scrollLeft;
    };

    const onWheel = (event: WheelEvent) => {
      if (
        mobile.matches ||
        event.ctrlKey ||
        element.scrollWidth <= element.clientWidth
      )
        return;
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      if (!delta) return;
      const unit =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? element.clientWidth
            : 1;
      event.preventDefault();
      if (reducedMotion.matches) element.scrollLeft += delta * unit;
      else move(delta * unit);
    };

    const tick = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 0;
      previousTime = time;
      const keyboardFocused =
        element.matches(":focus-visible") ||
        !!element.querySelector(":focus-visible");
      if (
        visible &&
        !document.hidden &&
        !mobile.matches &&
        !reducedMotion.matches &&
        !marqueePaused.current &&
        !popupHovered.current &&
        !keyboardFocused
      ) {
        move((group.offsetWidth * elapsed) / 40000);
      }
      frame = window.requestAnimationFrame(tick);
    };

    const onEnter = () => {
      if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
      pauseTimer.current = window.setTimeout(() => {
        marqueePaused.current = true;
      }, HOVER_DELAY_MS);
    };

    const onLeave = () => {
      if (pauseTimer.current) {
        window.clearTimeout(pauseTimer.current);
        pauseTimer.current = null;
      }
      if (!popupHovered.current) {
        marqueePaused.current = false;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(element);
    element.addEventListener("wheel", onWheel, { passive: false });
    element.addEventListener("mouseenter", onEnter);
    element.addEventListener("mouseleave", onLeave);
    frame = window.requestAnimationFrame(tick);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
      element.removeEventListener("wheel", onWheel);
      element.removeEventListener("mouseenter", onEnter);
      element.removeEventListener("mouseleave", onLeave);
    };
  }, [clusters]);

  function scheduleOpenPreview(slug: string, target: HTMLElement) {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
    }

    openTimer.current = window.setTimeout(() => {
      const sectionEl = sectionRef.current;
      if (sectionEl) {
        const sectionRect = sectionEl.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const popupWidth = Math.min(440, sectionRect.width - 32);
        const rawLeft = targetRect.left - sectionRect.left;
        const clampedLeft = Math.max(
          16,
          Math.min(rawLeft, sectionRect.width - popupWidth - 16),
        );
        setPopupLeft(clampedLeft);
      }
      marqueePaused.current = true;
      setActiveSlug(slug);
    }, HOVER_DELAY_MS);
  }

  function scheduleClosePreview() {
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
    }
    closeTimer.current = window.setTimeout(() => {
      if (!popupHovered.current) {
        setActiveSlug(null);
        marqueePaused.current = false;
      }
    }, CLOSE_DELAY_MS);
  }

  const activeCluster =
    clusters.find((cluster) => cluster.slug === activeSlug) || null;

  return (
    <section
      ref={sectionRef}
      id="research-clusters-section"
      className="discovery-clusters"
      aria-label="Research clusters"
      onMouseLeave={scheduleClosePreview}
    >
      <div
        ref={viewport}
        className="discovery-marquee-window"
        tabIndex={0}
        role="region"
        aria-label="Research clusters, scroll horizontally to explore"
      >
        <div ref={track} className="discovery-marquee-track">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="discovery-marquee-group"
              aria-hidden={copy === 1 ? true : undefined}
            >
              {clusters.map((cluster) => {
                const isActive = activeSlug === cluster.slug;
                return (
                  <Link
                    key={cluster.slug}
                    href={`/research?cluster=${encodeURIComponent(cluster.slug)}`}
                    className={`discovery-cluster ${isActive ? "discovery-cluster-active" : ""}`}
                    tabIndex={copy === 1 ? -1 : undefined}
                    onMouseEnter={(event) =>
                      scheduleOpenPreview(cluster.slug, event.currentTarget)
                    }
                    onMouseLeave={scheduleClosePreview}
                    onFocus={(event) =>
                      scheduleOpenPreview(cluster.slug, event.currentTarget)
                    }
                    onBlur={scheduleClosePreview}
                  >
                    {cluster.name}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div
        className={`discovery-cluster-popup ${activeCluster ? "is-open" : ""}`}
        style={popupLeft !== null ? { left: `${popupLeft}px` } : undefined}
        aria-hidden={!activeCluster}
        onMouseEnter={() => {
          popupHovered.current = true;
          marqueePaused.current = true;
          if (closeTimer.current) {
            window.clearTimeout(closeTimer.current);
            closeTimer.current = null;
          }
        }}
        onMouseLeave={() => {
          popupHovered.current = false;
          scheduleClosePreview();
        }}
      >
        {activeCluster && (
          <div key={activeCluster.slug} className="discovery-cluster-popup-inner">
            <div className="discovery-cluster-popup-footer">
              {activeCluster.tags && activeCluster.tags.length > 0 && (
                <div
                  className="discovery-cluster-preview-tags"
                  aria-label="Research subtopics"
                >
                  {activeCluster.tags.map((tag) => (
                    <Link
                      key={tag.id || tag.slug}
                      href={`/tag-research-areas/${encodeURIComponent(tag.slug)}`}
                      className="discovery-cluster-topic-pill"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}
              <Link
                href={`/research?cluster=${encodeURIComponent(activeCluster.slug)}`}
                className="discovery-cluster-popup-link"
              >
                <span>Explore</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
