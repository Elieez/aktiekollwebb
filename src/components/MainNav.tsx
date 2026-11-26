"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Insideraffärer", match: (p: string) => p === "/" || p.startsWith("/trades") },
  { href: "/blankning", label: "Blankning", match: (p: string) => p.startsWith("/blankning") },
];

export default function MainNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Huvudmeny" className="ml-3 flex items-center gap-3 sm:ml-6 sm:gap-5">
      {links.map(({ href, label, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`border-b-2 py-1 text-xs font-medium transition-colors sm:text-sm ${
              active
                ? "border-accent text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
