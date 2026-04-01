import { Eye, TrendingUp, Bell } from "lucide-react";

const cards = [
    {
        icon: Eye,
        title: "Vad är insynshandel?",
        body: "Insynspersoner — VD, CFO, styrelseledamöter och andra med tillgång till icke-offentlig information — är skyldiga att anmäla alla köp och försäljningar av aktier i det egna bolaget. Dessa affärer publiceras offentligt av Finansinspektionen och uppdateras löpande.",
    },
    {
        icon: TrendingUp,
        title: "Varför är det intressant?",
        body: "Insiders känner sitt bolag bättre än någon annan. Forskning visar att insider-köp historiskt sett ofta föregår positiv kursutveckling — särskilt när flera ledande befattningshavare köper samtidigt. Att följa insynshandel ger en unik inblick i hur ledningen själva bedömer framtiden.",
    },
    {
        icon: Bell,
        title: "Hur använder jag tjänsten?",
        body: "Bläddra bland senaste transaktionerna på startsidan, sök efter ett specifikt bolag och se dess historiska insideraffärer, eller bevaka upp till 3 bolag och få e-postnotifikationer direkt när en ny transaktion rapporteras. Allt kräver bara ett gratis konto.",
    },
];

export default function Explainer() {
    return (
        <div className="border-b border-border bg-bg2">
            <div className="mx-auto max-w-380 px-4 py-8 sm:px-8">

                <div className="mb-6">
                    <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">
                        Så fungerar det
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {cards.map(({ icon: Icon, title, body }) => (
                        <div key={title} className="rounded-xl border border-border bg-bg p-5 space-y-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim">
                                <Icon className="h-4 w-4 text-accent" />
                            </div>
                            <h3 className="font-display text-sm font-semibold text-ink">{title}</h3>
                            <p className="text-xs leading-relaxed text-muted">{body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
