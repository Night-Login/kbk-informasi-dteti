"use client";

import { ChevronDown, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BrandMark from "@/components/global/brand-mark";
import SearchModal from "@/components/global/search-modal";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Research", href: "/research", dropdown: true },
  { label: "People", href: "/people" },
  { label: "Publication", href: "/publication" },
  { label: "Academic", href: "/academic" },
  { label: "Update", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // Register Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header className="site-header brand-gradient fixed inset-x-0 top-0 border-b-2 border-dteti-yellow">
        <div className="page-container flex h-16 items-center justify-between sm:h-20">
          <BrandMark compact />

          <nav
            className="hidden items-center gap-5 xl:gap-7 lg:flex"
            aria-label="Navigasi utama"
          >
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/academic" && pathname === "/scholarships");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white ${
                    isActive ? "text-white" : ""
                  }`}
                >
                  {item.label}
                  {item.dropdown ? (
                    <ChevronDown size={13} aria-hidden="true" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            {/* Desktop Search Button */}
            <button
              type="button"
              aria-label="Cari (Ctrl+K)"
              title="Pencarian (Ctrl+K)"
              onClick={() => setIsSearchOpen(true)}
              className="hidden size-10 place-items-center text-white/90 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dteti-yellow lg:grid cursor-pointer"
            >
              <Search size={18} aria-hidden="true" />
            </button>

            {/* Mobile Search Button */}
            <button
              type="button"
              aria-label="Cari"
              onClick={() => setIsSearchOpen(true)}
              className="grid size-10 place-items-center text-white/90 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dteti-yellow lg:hidden cursor-pointer"
            >
              <Search size={18} aria-hidden="true" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="grid size-10 place-items-center text-white/90 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dteti-yellow lg:hidden cursor-pointer"
              aria-label={isOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsOpen((current) => !current)}
            >
              {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>

        <nav
          id="mobile-navigation"
          className={`${isOpen ? "block" : "hidden"} brand-gradient border-t border-white/15 px-4 py-4 lg:hidden`}
          aria-label="Navigasi perangkat seluler"
        >
          <div className="page-container flex flex-col">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between border-b border-white/15 py-3 text-sm font-semibold text-white/90 hover:text-white"
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

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
