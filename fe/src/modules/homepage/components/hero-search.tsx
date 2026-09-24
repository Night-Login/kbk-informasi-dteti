"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { searchUniversal } from "@/lib/api";

type Result = { id: string; title: string; href: string };

export default function HeroSearch() {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(-1);
  const [retry, setRetry] = useState(0);
  const [response, setResponse] = useState<{ query: string; items: Result[]; error: boolean } | null>(null);
  const term = query.trim();
  const current = response?.query === term ? response : null;
  const items = current?.items || [];
  const expanded = focused && term.length >= 2;

  useEffect(() => {
    if (term.length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      searchUniversal(term, { limit: 2, signal: controller.signal }).then((data) => {
        if (controller.signal.aborted) return;
        const results = [
          ...data.lecturers.map((item) => ({ id: `person-${item.id}`, title: item.full_name, href: `/people/${item.slug || item.id}` })),
          ...data.research_tags.map((item) => ({ id: `research-${item.id}`, title: item.name, href: `/tag-research-areas/${item.slug || item.id}` })),
          ...data.projects.map((item) => ({ id: `project-${item.id}`, title: item.title, href: "/projects" })),
          ...data.publications.map((item) => ({ id: `publication-${item.id}`, title: item.title, href: "/publication" })),
          ...data.content.map((item) => ({ id: `content-${item.id}`, title: item.title, href: item.type === "EVENT" ? `/events#${item.slug || item.id}` : `/news/${item.slug || item.id}` })),
        ];
        setResponse({ query: term, items: results.slice(0, 6), error: false });
      }).catch(() => {
        if (!controller.signal.aborted) setResponse({ query: term, items: [], error: true });
      });
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [term, query, retry]);

  useEffect(() => {
    if (expanded && active >= 0) document.getElementById(`hero-result-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, expanded]);

  return <div className="hero-search" onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) { setFocused(false); setActive(-1); }
  }}>
    <div className="discovery-search-trigger hero-search-field">
      <input ref={input} aria-label="Search research, people, and projects" role="combobox" aria-autocomplete="list" aria-expanded={expanded} aria-controls="hero-search-results" aria-activedescendant={expanded && active >= 0 && items[active] ? `hero-result-${active}` : undefined} autoComplete="off" value={query}
        onFocus={() => setFocused(true)}
        onChange={(event) => { setQuery(event.target.value); setResponse(null); setActive(-1); setFocused(true); }}
        onKeyDown={(event) => {
          if (event.key === "Escape") { setFocused(false); setActive(-1); input.current?.blur(); }
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault(); setFocused(true);
            if (items.length) setActive((index) => event.key === "ArrowDown" ? (index + 1) % items.length : (index <= 0 ? items.length - 1 : index - 1));
          }
          if (event.key === "Enter" && expanded && items.length) { event.preventDefault(); router.push(items[active >= 0 ? active : 0].href); setFocused(false); }
        }} />
      {!query && !focused && <span className="hero-search-placeholder" aria-hidden="true">
        <span className="discovery-search-static">Explore research, people, projects...</span>
        <span className="discovery-search-animation"><span>Explore research, people, projects...</span><span>Explore research...</span><span>Explore people...</span><span>Explore projects...</span></span>
      </span>}
      {query && <button type="button" className="hero-search-clear" aria-label="Clear hero search" onClick={() => { setQuery(""); setResponse(null); setActive(-1); input.current?.focus(); }}><X size={20} /></button>}
    </div>
    {expanded && <div className="hero-search-results">
      <p role="status">{!current ? "Searching…" : current.error ? "Search is unavailable." : !items.length ? `No results for “${term}”.` : ""}</p>
      {current?.error && <button type="button" onClick={() => { setResponse(null); setRetry((value) => value + 1); }}>Try again</button>}
      <ul id="hero-search-results" role="listbox" aria-label="Hero search results">
        {items.map((item, index) => <li key={item.id} role="presentation"><a id={`hero-result-${index}`} role="option" aria-selected={active === index} tabIndex={-1} href={item.href} onMouseEnter={() => setActive(index)}>{item.title}</a></li>)}
      </ul>
    </div>}
  </div>;
}
