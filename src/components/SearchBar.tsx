"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
// Search icon from lucide-react was imported but never used — removed (custom inline SVG is used instead)

type Result = { symbol: string; description: string };

export default function CompanySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState<number>(-1);

  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listId = "company-search-listbox";

  function onSelect(symbol: string) {
    const yahooSymbol = symbol.includes('.') ? symbol : `${symbol}.ST`;
    router.push(`/stocks/${yahooSymbol}`);
    setQuery("");
    setResults([]);
    setOpen(false);
    setHighlight(-1);
  }

  // Click outside to close
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Debounced search with abort
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    const ac = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(query)}`,
          { signal: ac.signal }
        );
        const data: Result[] = await res.json();
        setResults(data);
        setOpen(true);
        setHighlight(data.length ? 0 : -1);
      } catch {
        /* ignore abort/network */
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      ac.abort();
      clearTimeout(t);
    };
  }, [query]);

  // Keyboard navigation
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (results.length ? (h + 1) % results.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) =>
        results.length ? (h - 1 + results.length) % results.length : -1
      );
    } else if (e.key === "Enter") {
      if (open && highlight >= 0 && results[highlight]) {
        onSelect(results[highlight].symbol);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative max-w-120 flex-1">
      {/* Icon */}
      <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle cx="6.5" cy="6.5" r="5" stroke="white" strokeWidth="1.5" />
          <path d="M10.5 10.5L14 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length && setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Sök bolag, ticker..."
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={
          open && highlight >= 0 ? `${listId}-option-${highlight}` : undefined
        }
        className="w-full rounded-lg border border-white/[0.07] bg-bg3 py-2 pl-9 pr-3 font-sans text-[13px]
        text-ink placeholder:text-[#666] outline-none transition-colors focus:border-white/12"
      />

      {/* Dropdown */}
      {open && (
        <ul
          id={listId}
          role="listbox"
          className="
            absolute mt-2 w-full max-h-64 overflow-y-auto 
            rounded-xl 
            border border-white/[0.07] 
            bg-bg2 
            shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur
            dark-scrollbar">
          {loading && (
            <li className="px-4 py-3 text-sm text-[#555]">Söker…</li>
          )}

          {!loading && results.length === 0 && query.length >= 2 && (
            <li className="px-4 py-3 text-sm text-[#555]">Inga träffar</li>
          )}

          {!loading &&
            results.map((r, i) => (
              <li
                key={`${r.symbol}-${i}`}
                id={`${listId}-option-${i}`}
                role="option"
                aria-selected={i === highlight}
                className={`
                  px-4 py-3 
                  cursor-pointer 
                  transition-colors
                  border-b border-white/4 last:border-b-0 
                  
                  ${
                  // Missing '#' prefix on hex color — Tailwind requires it: bg-[#181b1f]
                  i === highlight
                  ? "bg-bg3"
                  : "hover:bg-[#181b1f]"
                }`}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelect(r.symbol)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-ink font-medium">
                    {r.description}
                  </span>
                  <span className="text-[12px] font-mono text-[#666]">
                    ({r.symbol})
                  </span>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
