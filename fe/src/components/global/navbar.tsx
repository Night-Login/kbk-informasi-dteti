"use client";

import { ChevronDown, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BrandMark from "@/components/global/brand-mark";

const navigation = [
  { label: "Research", href: "/research", dropdown: true },
  { label: "People", href: "/people" },
  { label: "Publication", href: "/publication" },
  { label: "Academic", href: "/academic" },
  { label: "Update", href: "/#news", dropdown: true },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isWireframeRoute = [
    "/academic",
    "/research",
    "/research-areas",
    "/tag-research-areas",
  ].some((route) => pathname === route || pathname.startsWith(`${route}/`));

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 border-b bg-white ${isWireframeRoute ? "border-line" : "border-ugm-blue/15"
        }`}
    >
      <div className="page-container flex h-16 items-center justify-between">
        <div className={isWireframeRoute ? "grayscale" : undefined}>
          <BrandMark compact />
        </div>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigasi utama">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link inline-flex items-center gap-1.5 text-xs font-semibold text-ink ${isWireframeRoute ? "low-fi hover:text-ink" : "hover:text-ugm-blue"
                }`}
            >
              {item.label}
              {item.dropdown ? (
                <ChevronDown size={13} aria-hidden="true" />
              ) : null}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Cari"
          className={`hidden size-10 place-items-center text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus lg:grid ${isWireframeRoute
              ? "hover:bg-surface"
              : "hover:bg-ugm-blue-soft hover:text-ugm-blue"
            }`}
        >
          <Search size={18} aria-hidden="true" />
        </button>

        <button
          type="button"
          className={`grid size-10 place-items-center text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus lg:hidden ${isWireframeRoute
              ? "hover:bg-surface"
              : "hover:bg-ugm-blue-soft hover:text-ugm-blue"
            }`}
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <nav
        id="mobile-navigation"
        className={`${isOpen ? "block" : "hidden"} border-t bg-white px-4 py-4 lg:hidden ${isWireframeRoute ? "border-line" : "border-ugm-blue/15"
          }`}
        aria-label="Navigasi perangkat seluler"
      >
        <div className="page-container flex flex-col">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between border-b py-3 text-sm font-semibold text-ink ${isWireframeRoute
                  ? "border-line hover:text-ink"
                  : "border-ugm-blue/15 hover:text-ugm-blue"
                }`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
              {item.dropdown ? (
                <ChevronDown size={15} aria-hidden="true" />
              ) : null}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
