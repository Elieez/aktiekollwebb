import Link from "next/link";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-bg2">
            <div className="mx-auto max-w-7xl px-4 sm:px-8 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <p className="font-display text-sm font-bold tracking-tight text-ink">
                    Aktie<span className="text-accent">Koll</span>
                </p>

                <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
                    <Link href="/" className="hover:text-ink transition-colors">Hem</Link>
                    <Link href="/om" className="hover:text-ink transition-colors">Om tjänsten</Link>
                    <Link href="/bevakningslista" className="hover:text-ink transition-colors">Bevakningslista</Link>
                    <Link href="/settings" className="hover:text-ink transition-colors">Inställningar</Link>
                    <Link href="/anvandarvillkor" className="hover:text-ink transition-colors">Användarvillkor</Link>
                    <Link href="/integritetspolicy" className="hover:text-ink transition-colors">Integritetspolicy</Link>
                </div>

                <p className="text-xs text-faint">© {year} AktieKoll</p>

            </div>
        </footer>
    );
}
