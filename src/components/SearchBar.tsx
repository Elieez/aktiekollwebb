'use client';

import { useEffect, useState } from "react";

export default function CompanySearch({
  onSelect,
}: {
  onSelect?: (symbol: string) => void;
}) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{symbol: string; description: string }[]>([]);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data);
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className="relative w-full max-w-md">
            <input 
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Search for a company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {results.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 max-h-60 overflow-y-auto">
                    {results.map((r) => (
                        <li 
                            key={`${r.symbol}-${r.description}`}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                onSelect?.(r.symbol);
                                setQuery('');
                                setResults([]);
                            }}
                        >
                          {r.description} ({r.symbol})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}