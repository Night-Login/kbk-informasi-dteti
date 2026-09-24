"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { searchUniversal, type UniversalSearchResult } from "@/lib/api";

type Result = { id: string; title: string; kind: string; href: string };
function toResults(data: UniversalSearchResult): Result[] {
  return [
    ...data.lecturers.map((item) => ({ id: `person-${item.id}`, title: item.full_name, kind: "People", href: `/people/${item.slug || item.id}` })),
    ...data.research_tags.map((item) => ({ id: `topic-${item.id}`, title: item.name, kind: "Research", href: `/tag-research-areas/${item.slug || item.id}` })),
    ...data.publications.map((item) => ({ id: `publication-${item.id}`, title: item.title, kind: "Publication", href: "/publication" })),
    ...data.projects.map((item) => ({ id: `project-${item.id}`, title: item.title, kind: "Project", href: "/projects" })),
    ...data.content.map((item) => ({ id: `content-${item.id}`, title: item.title, kind: item.type === "EVENT" ? "Event" : "News", href: item.type === "EVENT" ? `/events#${item.slug || item.id}` : `/news/${item.slug || item.id}` })),
  ];
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return isOpen ? <SearchContent onClose={onClose} /> : null;
}

function SearchContent({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<{ query: string; items: Result[]; error: boolean } | null>(null);
  const [active, setActive] = useState(-1);
  const [retry, setRetry] = useState(0);
  const term = query.trim();
  const current = response?.query === term ? response : null;
  const pending = term.length >= 2 && !current;
  const items = current?.items || [];

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    input.current?.focus();
    document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, []);

  useEffect(() => {
    if (term.length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      searchUniversal(term, { limit: 2, signal: controller.signal })
        .then((data) => { if (!controller.signal.aborted) setResponse({ query: term, items: toResults(data), error: false }); })
        .catch(() => { if (!controller.signal.aborted) setResponse({ query: term, items: [], error: true }); });
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [term, query, retry]);

  useEffect(() => { if (active >= 0) document.getElementById(`search-result-${active}`)?.scrollIntoView({ block: "nearest" }); }, [active]);

  function onKey(event: KeyboardEvent<HTMLInputElement>) {
    if (!items.length) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => event.key === "ArrowDown" ? (index + 1) % items.length : (index <= 0 ? items.length - 1 : index - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      router.push(items[active >= 0 ? active : 0].href);
      onClose();
    }
  }

  return <dialog ref={dialog} className="simple-search" aria-label="Search KBK Informasi" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="simple-search-inner">
      <div className="simple-search-input-row">
        <Search size={21} aria-hidden="true" />
        <input ref={input} role="combobox" aria-label="Search keywords" aria-autocomplete="list" aria-controls="search-results" aria-expanded={items.length > 0} aria-activedescendant={active >= 0 && items[active] ? `search-result-${active}` : undefined} value={query} onChange={(event) => { setQuery(event.target.value); setActive(-1); setResponse(null); }} onKeyDown={onKey} placeholder="Search…" autoComplete="off" />
        <button type="button" onClick={onClose} aria-label="Close search"><X size={20} /></button>
      </div>
      <div className="simple-search-body" aria-busy={pending}>
        <p className="simple-search-status" role="status">{!term ? "Find people, research, and updates." : term.length < 2 ? "Enter at least 2 characters." : pending ? "Searching…" : current?.error ? "Search is unavailable. Please try again." : !items.length ? `No results for “${term}”.` : "Top results"}</p>
        {current?.error && <button type="button" className="simple-search-retry" onClick={() => { setResponse(null); setRetry((value) => value + 1); }}>Try again</button>}
        <ul id="search-results" role="listbox" aria-label="Search results">
          {items.map((item, index) => <li key={item.id} role="presentation"><a id={`search-result-${index}`} role="option" aria-selected={active === index} href={item.href} tabIndex={-1} onMouseEnter={() => setActive(index)} onClick={(event) => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) { event.preventDefault(); router.push(item.href); onClose(); } }}><span>{item.title}</span><small>{item.kind}</small></a></li>)}
        </ul>
      </div>
    </div>
  </dialog>;
}
