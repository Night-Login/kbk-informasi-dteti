"use client";

import { ChevronDown, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BrandMark from "@/components/global/brand-mark";
import SearchModal from "@/components/global/search-modal";

interface NavSubItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: NavSubItem[];
}

const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Research", href: "/research" },
  { label: "People", href: "/people" },
  { label: "Publication", href: "/publication" },
  { label: "Academic", href: "/academic" },
  { label: "FAQ", href: "/faq" },
  {
    label: "Updates",
    href: "/news",
    children: [
      { label: "News", href: "/news" },
      { label: "Events", href: "/events" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  // Click outside to close desktop dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <header className="site-header brand-gradient fixed inset-x-0 top-0 border-b-2 border-dteti-yellow z-40">
        <div className="page-container flex h-16 items-center justify-between sm:h-20">
          <BrandMark compact />

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-4 xl:gap-6 lg:flex"
            aria-label="Navigasi utama"
          >
            {navigation.map((item) => {
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isChildActive = hasChildren
                ? item.children!.some(
                    (child) =>
                      pathname === child.href ||
                      (child.href === "/news" && pathname.startsWith("/news/")),
                  )
                : false;
              const isActive =
                pathname === item.href ||
                (item.href === "/academic" && pathname === "/scholarships") ||
                isChildActive;

              if (hasChildren) {
                const isDropdownVisible = openDropdown === item.label;

                return (
                  <div
                    key={item.label}
                    ref={dropdownRef}
                    className="relative py-2"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown((prev) =>
                          prev === item.label ? null : item.label,
                        )
                      }
                      className={`nav-link inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white cursor-pointer ${
                        isActive ? "text-white" : ""
                      }`}
                      aria-expanded={isDropdownVisible}
                      aria-haspopup="true"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${
                          isDropdownVisible
                            ? "rotate-180 text-dteti-yellow"
                            : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {/* Desktop Dropdown Menu with Hover Bridge */}
                    {isDropdownVisible && (
                      <div className="absolute top-full left-0 pt-2 w-44 z-50">
                        <div className="rounded-lg border-2 border-dteti-yellow bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                          {item.children!.map((subItem) => {
                            const isSubActive =
                              pathname === subItem.href ||
                              (subItem.href === "/news" &&
                                pathname.startsWith("/news/"));

                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => {
                                  setOpenDropdown(null);
                                }}
                                className={`flex items-center justify-between rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                                  isSubActive
                                    ? "bg-dteti-blue-soft text-dteti-blue font-bold"
                                    : "text-dteti-ink hover:bg-dteti-blue-soft/50 hover:text-dteti-blue"
                                }`}
                              >
                                <span>{subItem.label}</span>
                                {isSubActive && (
                                  <span className="size-1.5 rounded-full bg-dteti-blue" />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white ${
                    isActive ? "text-white" : ""
                  }`}
                >
                  {item.label}
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

        {/* Mobile Navigation Drawer */}
        <nav
          id="mobile-navigation"
          className={`${
            isOpen ? "block" : "hidden"
          } brand-gradient border-t border-white/15 px-4 py-4 lg:hidden`}
          aria-label="Navigasi perangkat seluler"
        >
          <div className="page-container flex flex-col">
            {navigation.map((item) => {
              const hasChildren = Boolean(item.children && item.children.length > 0);

              if (hasChildren) {
                return (
                  <div key={item.label} className="border-b border-white/15">
                    <button
                      type="button"
                      onClick={() => setMobileDropdownOpen((prev) => !prev)}
                      className="flex w-full items-center justify-between py-3 text-sm font-semibold text-white/90 hover:text-white cursor-pointer"
                      aria-expanded={mobileDropdownOpen}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 ${
                          mobileDropdownOpen
                            ? "rotate-180 text-dteti-yellow"
                            : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {mobileDropdownOpen && (
                      <div className="flex flex-col pb-2 pl-4 space-y-1">
                        {item.children!.map((subItem) => {
                          const isSubActive =
                            pathname === subItem.href ||
                            (subItem.href === "/news" &&
                              pathname.startsWith("/news/"));

                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setIsOpen(false)}
                              className={`py-2 text-xs font-semibold transition-colors ${
                                isSubActive
                                  ? "text-dteti-yellow font-bold"
                                  : "text-white/80 hover:text-white"
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between border-b border-white/15 py-3 text-sm font-semibold text-white/90 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
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
