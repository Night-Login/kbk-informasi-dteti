"use client";

import { ChevronDown, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BrandMark from "@/components/global/brand-mark";

const navigation = [
  { label: "Research", href: "/#research", dropdown: true },
  { label: "People", href: "/people" },
  { label: "Publication", href: "/#publication" },
  { label: "Academic", href: "/#academic" },
  { label: "Update", href: "/#news", dropdown: true },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header fixed inset-x-0 top-0 border-b border-line/60 bg-white">
      <div className="page-container flex h-16 items-center justify-between">
        <BrandMark compact />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigasi utama">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link inline-flex items-center gap-1.5 text-xs font-semibold text-ink"
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
          className="hidden size-10 place-items-center text-ink hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus lg:grid"
        >
          <Search size={18} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="grid size-10 place-items-center text-ink hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus lg:hidden"
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
        className={`${isOpen ? "block" : "hidden"} border-t border-line bg-white px-4 py-4 lg:hidden`}
        aria-label="Navigasi perangkat seluler"
      >
        <div className="page-container flex flex-col">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between border-b border-line/60 py-3 text-sm font-semibold text-ink"
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
