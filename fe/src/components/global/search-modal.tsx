"use client";

import {
  BookOpen,
  Briefcase,
  ChevronRight,
  GraduationCap,
  Loader2,
  Newspaper,
  Search,
  Sparkles,
  Tag,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  getApiAssetUrl,
  searchUniversal,
  type UniversalSearchResult,
} from "@/lib/api";
import TopicTag from "@/components/global/topic-tag";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FlattenedSearchItem {
  id: string;
  category:
    | "lecturers"
    | "tags"
    | "publications"
    | "projects"
    | "content"
    | "quick";
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  badgeType?: "supervisor" | "neutral" | "cluster";
  imageUrl?: string | null;
  href: string;
}

const POPULAR_TOPICS = [
  { name: "Machine Learning", slug: "machine-learning" },
  { name: "Deep Learning", slug: "deep-learning" },
  { name: "Artificial Intelligence", slug: "artificial-intelligence" },
  { name: "Computer Vision", slug: "computer-vision" },
  { name: "Cybersecurity", slug: "cybersecurity" },
  { name: "IoT", slug: "iot" },
  { name: "Software Engineering", slug: "software-engineering" },
  { name: "Human-Computer Interaction", slug: "human-computer-interaction" },
];

const QUICK_LINKS = [
  { label: "Daftar Dosen & Peneliti", href: "/people", icon: User },
  { label: "Bidang Riset & Cluster", href: "/research-areas", icon: Tag },
  { label: "Publikasi Ilmiah", href: "/publication", icon: BookOpen },
  { label: "Proyek & Kolaborasi", href: "/projects", icon: Briefcase },
  {
    label: "Program Akademik & Beasiswa",
    href: "/scholarships",
    icon: GraduationCap,
  },
  { label: "Berita & Pengumuman", href: "/news", icon: Newspaper },
];

function formatDate(dateStr?: string | Date | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  if (!isOpen) return null;
  return <SearchModalContent onClose={onClose} />;
}

function SearchModalContent({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<UniversalSearchResult | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Auto-focus input and lock body scroll on mount
  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Global Esc keydown listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [onClose]);

  // Debounced search query
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchUniversal(trimmed, {
          limit: 4,
          signal: controller.signal,
        });
        setResults(data);
        setSelectedIndex(0);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Search error:", err);
        }
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  const activeResults = query.trim().length >= 2 ? results : null;

  // Flatten results sequentially for linear keyboard navigation
  const flattenedItems = useMemo<FlattenedSearchItem[]>(() => {
    // If user hasn't typed a query yet, allow keyboard navigation across Quick Links
    if (!activeResults) {
      return QUICK_LINKS.map((link, idx) => ({
        id: `quick-${idx}`,
        category: "quick",
        title: link.label,
        href: link.href,
      }));
    }

    const items: FlattenedSearchItem[] = [];

    // 1. Lecturers
    activeResults.lecturers.forEach((l) => {
      const isAvailable =
        l.supervision_status &&
        !["unavailable", "not available", "closed", "tidak tersedia"].includes(
          l.supervision_status.trim().toLowerCase(),
        );

      items.push({
        id: `lecturer-${l.id}`,
        category: "lecturers",
        title: l.full_name,
        subtitle: l.academic_title || l.primary_cluster || "Dosen DTETI",
        badge: isAvailable ? "Tersedia Bimbingan S2/S3" : null,
        badgeType: "supervisor",
        imageUrl: l.photo_url ? getApiAssetUrl(l.photo_url) : null,
        href: `/people/${l.slug || l.id}`,
      });
    });

    // 2. Research Tags
    activeResults.research_tags.forEach((t) => {
      items.push({
        id: `tag-${t.id}`,
        category: "tags",
        title: t.name,
        subtitle: t.cluster_name
          ? `Cluster: ${t.cluster_name}`
          : "Bidang Riset",
        badge: "Topik Riset",
        badgeType: "neutral",
        href: `/tag-research-areas/${t.slug || t.id}`,
      });
    });

    // 3. Publications
    activeResults.publications.forEach((p) => {
      items.push({
        id: `pub-${p.id}`,
        category: "publications",
        title: p.title,
        subtitle: [p.venue, p.year].filter(Boolean).join(" • "),
        badge: p.year ? String(p.year) : null,
        badgeType: "neutral",
        href: `/publication`,
      });
    });

    // 4. Projects
    activeResults.projects.forEach((pr) => {
      items.push({
        id: `project-${pr.id}`,
        category: "projects",
        title: pr.title,
        subtitle: pr.lead_lecturer
          ? `Ketua: ${pr.lead_lecturer}`
          : "Proyek Riset",
        badge: pr.status || null,
        badgeType: "neutral",
        href: `/projects`,
      });
    });

    // 5. News & Events
    activeResults.content.forEach((c) => {
      items.push({
        id: `content-${c.id}`,
        category: "content",
        title: c.title,
        subtitle: formatDate(c.date),
        badge: c.type === "EVENT" ? "Agenda" : "Berita",
        badgeType: "neutral",
        href: c.type === "EVENT" ? `/events` : `/news/${c.slug || c.id}`,
      });
    });

    return items;
  }, [activeResults]);

  // Unified single-point keyboard navigation handler
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      onClose();
      return;
    }

    if (flattenedItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();
      setSelectedIndex((prev) => (prev + 1) % flattenedItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      e.stopPropagation();
      setSelectedIndex((prev) =>
        prev <= 0 ? flattenedItems.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      const targetIndex = selectedIndex >= 0 ? selectedIndex : 0;
      if (targetIndex < flattenedItems.length) {
        const item = flattenedItems[targetIndex];
        router.push(item.href);
        onClose();
      }
    }
  };

  // Scroll active item into view seamlessly
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.querySelector(
        `[data-search-index="${selectedIndex}"]`,
      );
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  const hasResults = flattenedItems.length > 0;
  const isQueryTooShort = query.trim().length > 0 && query.trim().length < 2;
  const isNoResults = query.trim().length >= 2 && !loading && !activeResults?.total_matches;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-dteti-ink/60 p-3 sm:p-6 sm:pt-20 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pencarian Platform KBK DTETI"
    >
      <div
        className="w-full max-w-2xl rounded-xl border-2 border-dteti-yellow bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Search Input */}
        <div className="relative flex items-center border-b-2 border-dteti-yellow bg-white px-4 py-3 sm:px-5">
          <Search
            size={20}
            className="text-dteti-blue shrink-0 mr-3"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Cari dosen, topik riset, publikasi, event..."
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-dteti-ink placeholder:text-muted/70 focus:outline-none"
            aria-label="Kata kunci pencarian"
          />

          {loading ? (
            <Loader2
              size={18}
              className="animate-spin text-dteti-blue shrink-0 ml-2"
            />
          ) : query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedIndex(-1);
                inputRef.current?.focus();
              }}
              className="p-1 text-muted hover:text-dteti-ink transition-colors ml-1 cursor-pointer"
              aria-label="Hapus teks pencarian"
            >
              <X size={16} />
            </button>
          ) : null}

          <kbd className="hidden sm:inline-flex items-center gap-0.5 border border-line bg-surface px-2 py-0.5 text-[11px] font-bold text-muted ml-3 select-none">
            ESC
          </kbd>
        </div>

        {/* Modal Body / Results */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 text-sm"
        >
          {/* Zero Query State: Popular Topics & Quick Links */}
          {!query.trim() && (
            <div className="space-y-6">
              {/* Popular Topics */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-dteti-blue" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">
                    Topik Riset Populer
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TOPICS.map((topic) => (
                    <button
                      key={topic.slug}
                      type="button"
                      onClick={() => {
                        setQuery(topic.name);
                        inputRef.current?.focus();
                      }}
                      className="cursor-pointer transition-transform hover:scale-[1.02]"
                    >
                      <TopicTag>{topic.name}</TopicTag>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links with Keyboard Focus */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">
                  Navigasi Cepat
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUICK_LINKS.map((link, idx) => {
                    const Icon = link.icon;
                    const isSelected = selectedIndex === idx;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        data-search-index={idx}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between border p-3 text-xs font-bold transition-all group ${
                          isSelected
                            ? "border-dteti-blue bg-dteti-blue-soft text-dteti-blue ring-1 ring-dteti-blue"
                            : "border-line bg-surface/50 text-dteti-ink hover:border-dteti-blue hover:bg-dteti-blue-soft/50 hover:text-dteti-blue"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={16} className="text-dteti-blue" />
                          <span>{link.label}</span>
                        </div>
                        <ChevronRight
                          size={14}
                          className="text-muted group-hover:text-dteti-blue group-hover:translate-x-0.5 transition-all"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Query Too Short */}
          {isQueryTooShort && (
            <div className="py-8 text-center text-xs text-muted font-medium">
              Ketik minimal 2 karakter untuk mulai mencari...
            </div>
          )}

          {/* No Results Found */}
          {isNoResults && (
            <div className="py-10 text-center space-y-2">
              <p className="text-sm font-bold text-dteti-ink">
                Tidak ada hasil untuk &quot;{query}&quot;
              </p>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Coba gunakan kata kunci yang lebih umum seperti nama dosen,
                bidang riset, atau topik spesifik.
              </p>
            </div>
          )}

          {/* Categorized Search Results */}
          {hasResults && (
            <div className="space-y-5">
              {/* 1. Lecturers */}
              {activeResults?.lecturers &&
                activeResults.lecturers.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-2">
                      <User size={13} className="text-dteti-blue" />
                      <span className="text-xs font-bold uppercase tracking-wider text-muted">
                        Dosen & Peneliti ({activeResults.lecturers.length})
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {activeResults.lecturers.map((l) => {
                        const itemIndex = flattenedItems.findIndex(
                          (item) => item.id === `lecturer-${l.id}`,
                        );
                        const isSelected = selectedIndex === itemIndex;
                        const isAvailable =
                          l.supervision_status &&
                          ![
                            "unavailable",
                            "not available",
                            "closed",
                            "tidak tersedia",
                          ].includes(l.supervision_status.trim().toLowerCase());

                        return (
                          <Link
                            key={l.id}
                            href={`/people/${l.slug || l.id}`}
                            onClick={onClose}
                            data-search-index={itemIndex}
                            onMouseEnter={() => setSelectedIndex(itemIndex)}
                            className={`flex items-center justify-between border p-2.5 transition-all group ${
                              isSelected
                                ? "border-dteti-blue bg-dteti-blue-soft ring-1 ring-dteti-blue"
                                : "border-line bg-white hover:border-dteti-blue hover:bg-dteti-blue-soft/40"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-line bg-surface">
                                {l.photo_url && getApiAssetUrl(l.photo_url) ? (
                                  <Image
                                    src={getApiAssetUrl(l.photo_url)!}
                                    alt={l.full_name}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                    unoptimized
                                  />
                                ) : (
                                  <span className="grid size-full place-items-center text-sm font-bold text-muted">
                                    {l.full_name.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs sm:text-sm font-bold text-dteti-ink group-hover:text-dteti-blue truncate">
                                  {l.full_name}
                                </h4>
                                <p className="text-[11px] text-muted truncate">
                                  {l.academic_title ||
                                    l.primary_cluster ||
                                    "Dosen DTETI"}
                                </p>
                              </div>
                            </div>

                            {isAvailable && (
                              <span className="hidden sm:inline-flex items-center border border-dteti-ink/50 bg-dteti-yellow px-2 py-0.5 text-[10px] font-bold text-dteti-ink shrink-0 ml-2">
                                Bimbingan S2/S3
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                )}

              {/* 2. Research Tags (Consistent Sequential Single-Column List) */}
              {activeResults?.research_tags &&
                activeResults.research_tags.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag size={13} className="text-dteti-blue" />
                      <span className="text-xs font-bold uppercase tracking-wider text-muted">
                        Topik & Bidang Riset ({activeResults.research_tags.length})
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {activeResults.research_tags.map((t) => {
                        const itemIndex = flattenedItems.findIndex(
                          (item) => item.id === `tag-${t.id}`,
                        );
                        const isSelected = selectedIndex === itemIndex;

                        return (
                          <Link
                            key={t.id}
                            href={`/tag-research-areas/${t.slug || t.id}`}
                            onClick={onClose}
                            data-search-index={itemIndex}
                            onMouseEnter={() => setSelectedIndex(itemIndex)}
                            className={`flex items-center justify-between border p-2.5 transition-all group ${
                              isSelected
                                ? "border-dteti-blue bg-dteti-blue-soft ring-1 ring-dteti-blue"
                                : "border-line bg-white hover:border-dteti-blue hover:bg-dteti-blue-soft/40"
                            }`}
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <h4 className="text-xs font-bold text-dteti-ink group-hover:text-dteti-blue truncate">
                                {t.name}
                              </h4>
                              {t.cluster_name && (
                                <p className="text-[11px] text-muted truncate">
                                  {t.cluster_name}
                                </p>
                              )}
                            </div>
                            <ChevronRight
                              size={14}
                              className="text-muted group-hover:text-dteti-blue shrink-0"
                            />
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                )}

              {/* 3. Publications */}
              {activeResults?.publications &&
                activeResults.publications.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={13} className="text-dteti-blue" />
                      <span className="text-xs font-bold uppercase tracking-wider text-muted">
                        Publikasi ({activeResults.publications.length})
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {activeResults.publications.map((p) => {
                        const itemIndex = flattenedItems.findIndex(
                          (item) => item.id === `pub-${p.id}`,
                        );
                        const isSelected = selectedIndex === itemIndex;

                        return (
                          <Link
                            key={p.id}
                            href={`/publication`}
                            onClick={onClose}
                            data-search-index={itemIndex}
                            onMouseEnter={() => setSelectedIndex(itemIndex)}
                            className={`flex items-start justify-between border p-2.5 transition-all group ${
                              isSelected
                                ? "border-dteti-blue bg-dteti-blue-soft ring-1 ring-dteti-blue"
                                : "border-line bg-white hover:border-dteti-blue hover:bg-dteti-blue-soft/40"
                            }`}
                          >
                            <div className="min-w-0 flex-1 pr-3">
                              <h4 className="text-xs font-bold text-dteti-ink group-hover:text-dteti-blue line-clamp-2">
                                {p.title}
                              </h4>
                              <p className="text-[11px] text-muted mt-0.5 truncate">
                                {[p.venue, p.year].filter(Boolean).join(" • ")}
                              </p>
                            </div>
                            {p.year && (
                              <span className="border border-line bg-surface px-1.5 py-0.5 text-[10px] font-bold text-muted shrink-0">
                                {p.year}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                )}

              {/* 4. Projects */}
              {activeResults?.projects && activeResults.projects.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={13} className="text-dteti-blue" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">
                      Proyek Riset ({activeResults.projects.length})
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {activeResults.projects.map((pr) => {
                      const itemIndex = flattenedItems.findIndex(
                        (item) => item.id === `project-${pr.id}`,
                      );
                      const isSelected = selectedIndex === itemIndex;

                      return (
                        <Link
                          key={pr.id}
                          href={`/projects`}
                          onClick={onClose}
                          data-search-index={itemIndex}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={`flex items-center justify-between border p-2.5 transition-all group ${
                            isSelected
                              ? "border-dteti-blue bg-dteti-blue-soft ring-1 ring-dteti-blue"
                              : "border-line bg-white hover:border-dteti-blue hover:bg-dteti-blue-soft/40"
                          }`}
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <h4 className="text-xs font-bold text-dteti-ink group-hover:text-dteti-blue truncate">
                              {pr.title}
                            </h4>
                            {pr.lead_lecturer && (
                              <p className="text-[11px] text-muted truncate">
                                Ketua: {pr.lead_lecturer}
                              </p>
                            )}
                          </div>
                          <span className="border border-line bg-surface px-1.5 py-0.5 text-[10px] font-bold text-dteti-ink shrink-0">
                            {pr.status}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 5. News & Events */}
              {activeResults?.content && activeResults.content.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-2">
                    <Newspaper size={13} className="text-dteti-blue" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">
                      Berita & Agenda ({activeResults.content.length})
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {activeResults.content.map((c) => {
                      const itemIndex = flattenedItems.findIndex(
                        (item) => item.id === `content-${c.id}`,
                      );
                      const isSelected = selectedIndex === itemIndex;

                      return (
                        <Link
                          key={c.id}
                          href={
                            c.type === "EVENT" ? `/events` : `/news/${c.slug || c.id}`
                          }
                          onClick={onClose}
                          data-search-index={itemIndex}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={`flex items-center justify-between border p-2.5 transition-all group ${
                            isSelected
                              ? "border-dteti-blue bg-dteti-blue-soft ring-1 ring-dteti-blue"
                              : "border-line bg-white hover:border-dteti-blue hover:bg-dteti-blue-soft/40"
                          }`}
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <h4 className="text-xs font-bold text-dteti-ink group-hover:text-dteti-blue truncate">
                              {c.title}
                            </h4>
                            {c.date && (
                              <p className="text-[11px] text-muted">
                                {formatDate(c.date)}
                              </p>
                            )}
                          </div>
                          <span className="border border-line bg-surface px-1.5 py-0.5 text-[10px] font-bold text-muted shrink-0">
                            {c.type === "EVENT" ? "Agenda" : "Berita"}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Keyboard Help */}
        <div className="flex items-center justify-between border-t border-line bg-surface/80 px-4 py-2 text-[11px] text-muted">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="border border-line bg-white px-1 py-0.2 text-[10px] font-bold">
                ↑
              </kbd>
              <kbd className="border border-line bg-white px-1 py-0.2 text-[10px] font-bold">
                ↓
              </kbd>
              <span>Navigasi</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="border border-line bg-white px-1 py-0.2 text-[10px] font-bold">
                ↵
              </kbd>
              <span>Pilih</span>
            </span>
          </div>
          <span>Pencarian Terpadu KBK DTETI</span>
        </div>
      </div>
    </div>
  );
}
