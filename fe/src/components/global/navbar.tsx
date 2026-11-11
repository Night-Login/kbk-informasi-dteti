"use client";

import { usePathname } from "next/navigation";
import { DiscoveryHeader } from "@/modules/homepage/components/discovery-shell";

export default function Navbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <DiscoveryHeader key={pathname} home />;
}
