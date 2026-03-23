// components/Header.tsx
import Link from "next/link";
import CompanySearch from "@/components/SearchBar";
import { AuthStatus } from "./Auth";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-15 items-center gap-6 border-b border-white/[0.07]
                       bg-[#0b0d0f]/90 px-8 backdrop-blur-2xl">
        {/* Left: Logo & Title */}
        <div className="shrink-0 font-display text-lg font-bold tracking-tight text-[#f0ede8]">
          <Link href="/">
            Aktie<span className="text-[#c8f04d]">Koll</span>
          </Link>
        </div>

        {/* Middle: Searchbar (collapses on mobile) */}
        <div className="relative max-w-120 flex-1">
          <CompanySearch />
        </div>

        {/* Right: Auth status */}
        <div className="ml-auto flex shrink-0 items-center gap-3">
          {/* Put AuthStatus component here; it will render Sign in or Logout + name */}
          <AuthStatus />
        </div>
    </header>
  );
}
