import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
            <p className="font-mono text-[11px] uppercase tracking-widest text-accent mb-4">404</p>
            <h1 className="font-display text-3xl font-bold text-ink mb-3">Sidan hittades inte</h1>
            <p className="text-sm text-muted max-w-xs mb-8">
                Sidan du letar efter finns inte eller har flyttats.
            </p>
            <Link
                href="/"
                className="rounded-xl bg-accent px-5 py-2.5 font-display text-[13px] font-bold uppercase tracking-[0.06em] text-bg hover:opacity-90 transition-opacity"
            >
                Tillbaka till startsidan
            </Link>
        </main>
    );
}
