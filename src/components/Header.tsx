"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthStatus, EmailVerificationBanner } from "./Auth";
import SearchBar from "./SearchBar";

export default function Header() {
  const pathname = usePathname();

  // Auth pages carry their own branding — no global header there
  if (pathname.startsWith("/auth")) return null;

  return (
    <>
      <EmailVerificationBanner />
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight text-ink shrink-0"
          >
            Aktie<span className="text-accent">Koll</span>
          </Link>
          <SearchBar />
          <AuthStatus />
        </div>
      </header>
    </>
  );
}
