import Link from "next/link";
import { AuthStatus } from "./Auth";
import { EmailVerificationBanner } from "./Auth";

export default function Header() {
  return (
    <>
      <EmailVerificationBanner />
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight text-ink"
          >
            Aktie<span className="text-accent">Koll</span>
          </Link>
          <AuthStatus />
        </div>
      </header>
    </>
  );
}
