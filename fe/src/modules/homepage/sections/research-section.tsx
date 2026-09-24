"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest, type ResearchSummary } from "@/lib/api";
const initialClusters = [
  { name: "Intelligent Systems & Data", slug: "intelligent-systems-data" },
  { name: "Networks, Security & Infrastructure", slug: "networks-security-infrastructure" },
  { name: "IoT, Smart Systems & Environment", slug: "iot-smart-systems-environment" },
];
export default function ResearchSection() {
  const [clusters, setClusters] = useState(initialClusters);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    apiRequest<ResearchSummary>("research", { signal: controller.signal }).then((data) => {
      if (data.clusters.length) { setClusters(data.clusters); setLoaded(true); }
    }).catch(() => {});
    return () => controller.abort();
  }, []);
  return <section className="discovery-clusters" aria-label="Research clusters">
    <div className="discovery-marquee-window"><div className="discovery-marquee-track">
      {[0, 1].map((copy) => <div key={copy} className="discovery-marquee-group" aria-hidden={copy === 1 ? true : undefined} inert={copy === 1 ? true : undefined}>
        {clusters.map((cluster) => <Link key={cluster.slug} href={loaded ? `/research-areas#cluster-${encodeURIComponent(cluster.slug)}` : "/research-areas"} className="discovery-cluster" tabIndex={copy === 1 ? -1 : undefined}>{cluster.name}</Link>)}
      </div>)}
    </div></div>
  </section>;
}
