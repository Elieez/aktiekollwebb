"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { AuthStatus, EmailVerificationBanner } from "./Auth";
import CompanySearch from "@/components/SearchBar";
import { useTheme } from "@/components/ThemeProvider";

export default function Header() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  if (pathname.startsWith("/auth")) return null;

  return (
    <>
      <EmailVerificationBanner />
      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md backdrop-saturate-150">

        {/* Main row */}
        <div className="flex h-12 sm:h-14 items-center px-4 sm:px-8">

          {/* Left: Logo */}
          <div className="shrink-0 font-display text-lg font-bold tracking-tight text-ink">
            <Link href="/">
              Aktie<span className="text-accent">Koll</span>
            </Link>
          </div>

          {/* Middle: Search — absolutely centered, desktop only */}
          <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4">
            <CompanySearch />
          </div>

          {/* Right: Theme toggle (desktop only) + Auth */}
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <button
              onClick={toggle}
              aria-label={theme === "dark" ? "Byt till ljust läge" : "Byt till mörkt läge"}
              className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.07] text-muted hover:text-ink transition-colors cursor-pointer"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <AuthStatus />
          </div>

        </div>

        {/* Mobile search row */}
        <div className="sm:hidden px-4 pb-2">
          <CompanySearch />
        </div>

      </header>
    </>
  );
}