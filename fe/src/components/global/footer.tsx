"use client";

import { usePathname } from "next/navigation";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { DiscoveryFooter } from "@/modules/homepage/components/discovery-shell";

export default function Footer() {
  const pathname = usePathname();
  const settings = useSiteSettings(!pathname?.startsWith("/admin"));

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <DiscoveryFooter settings={settings} />;
}
