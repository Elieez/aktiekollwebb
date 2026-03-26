"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthStatus, EmailVerificationBanner } from "./Auth";
import CompanySearch from "@/components/SearchBar";

export default function Header() {
  const pathname = usePathname();

  if (pathname.startsWith("/auth")) return null;

  return (
    <>
      <EmailVerificationBanner />
      <header className="sticky top-0 z-50 flex h-15 items-center border-b border-white/[0.07]
                   bg-bg/60 px-4 backdrop-blur-md sm:px-8">
  
        {/* Left: Logo */}
        <div className="shrink-0 font-display text-lg font-bold tracking-tight text-ink">
          <Link href="/">
            Aktie<span className="text-accent">Koll</span>
          </Link>
        </div>

        {/* Middle: Search — absolutely centered */}
        <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4">
          <CompanySearch />
        </div>

        {/* Right: Auth */}
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <AuthStatus />
        </div>

      </header>
    </>
  );
}