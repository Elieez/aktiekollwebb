"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

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
    router.push(`/stocks/${symbol}`);
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
    <div ref={wrapperRef} className="relative w-full max-w-md z-50">
      {/* Icon */}
      <Search
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        size={18}
        aria-hidden="true"
      />

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length && setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search companies..."
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={
          open && highlight >= 0 ? `${listId}-option-${highlight}` : undefined
        }
        className="w-full pl-10 pr-3 py-2 rounded-md bg-gray-100 text-gray-900 placeholder-gray-500
                   border border-transparent focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Dropdown */}
      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute mt-2 w-full max-h-64 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
        >
          {loading && (
            <li className="px-3 py-2 text-sm text-gray-500">Searching…</li>
          )}

          {!loading && results.length === 0 && query.length >= 2 && (
            <li className="px-3 py-2 text-sm text-gray-500">No matches</li>
          )}

          {!loading &&
            results.map((r, i) => (
              <li
                key={`${r.symbol}-${i}`}
                id={`${listId}-option-${i}`}
                role="option"
                aria-selected={i === highlight}
                className={`px-3 py-2 cursor-pointer text-sm ${
                  i === highlight ? "bg-gray-100" : ""
                }`}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => {
                  // prevent input blur before click
                  e.preventDefault();
                }}
                onClick={() => onSelect(r.symbol)}
              >
                <span className="font-medium">{r.description}</span>{" "}
                <span className="text-gray-500">({r.symbol})</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
