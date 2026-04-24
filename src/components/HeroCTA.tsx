"use client";

import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import { useAuth } from "@/components/Auth";

const META_ITEMS = [
  "Följ upp till 3 bolag gratis",
  "Aviseringar via e-post",
  "Aviseringar via Discord",
];

const btnPrimary =
  "inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-5 font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-bg transition-opacity hover:opacity-90";

const btnSecondary =
  "inline-flex h-11 items-center rounded-xl border border-border bg-bg2 px-5 font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-muted transition-colors hover:bg-bg3 hover:text-ink";

export default function HeroCTA() {
  const { user, loading } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        {loading ? (
          <div className="h-11 w-48 animate-pulse rounded-xl bg-bg3" />
        ) : user ? (
          <Link href="/bevakningslista" className={btnPrimary}>
            Min bevakningslista
            <Bell className="h-4 w-4" />
          </Link>
        ) : (
          <Link href="/auth" className={btnPrimary}>
            Skapa konto
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
        <a href="#affarer" className={btnSecondary}>
          Se senaste affärer
        </a>
      </div>

      {/* Only show signup nudge to guests */}
      {!user && !loading && (
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {META_ITEMS.map(item => (
            <span key={item} className="inline-flex items-center gap-1.5 text-[13px] text-muted">
              <span className="font-semibold text-buy">✓</span>
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
