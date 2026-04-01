import Link from "next/link";
import { Eye, TrendingUp, Bell, Shield, BarChart2, Search } from "lucide-react";

export const metadata = {
    title: "Om AktieKoll",
    description: "Lär dig hur AktieKoll fungerar och varför insynshandel är viktig information för investerare.",
};

const features = [
    {
        icon: Search,
        title: "Sök bland alla bolag",
        body: "Sök upp vilket börsnoterat bolag som helst och se alla historiska insidertransaktioner, prisdiagram och en sammanfattning av handelsaktiviteten.",
    },
    {
        icon: Bell,
        title: "Bevaka och få notifikationer",
        body: "Bevaka upp till 3 bolag och få ett e-postmeddelande direkt när en ny insynstransaktion rapporteras. Du kan även koppla in Discord via en webhook.",
    },
    {
        icon: BarChart2,
        title: "Statistik i realtid",
        body: "Startsidan visar årets totala handelsvärde, antal transaktioner och vilka bolag som köpts eller sålts mest av sina egna insiders under månaden.",
    },
];

export default function OmPage() {
    return (
        <main className="min-h-screen bg-bg">

            {/* Hero */}
            <div className="border-b border-border">
                <div className="mx-auto max-w-3xl px-4 sm:px-8 pt-14 pb-12">
                    <p className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
                        Om tjänsten
                    </p>
                    <h1 className="font-display text-[clamp(28px,4vw,48px)] font-bold leading-[1.1] tracking-[-0.03em] text-ink mb-4">
                        Öppenhet kring<br />
                        <span className="text-accent">insiderhandel</span> på börsen
                    </h1>
                    <p className="text-sm leading-7 text-muted max-w-xl">
                        AktieKoll är en gratis tjänst som samlar och presenterar offentlig insynsdata
                        från Finansinspektionen — så att du enkelt kan följa vad bolagsledare
                        gör med sina egna aktier.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-4 sm:px-8 py-12 space-y-14">

                {/* What is insider trading */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim">
                            <Eye className="h-4 w-4 text-accent" />
                        </div>
                        <h2 className="font-display text-lg font-bold text-ink">Vad är insynshandel?</h2>
                    </div>
                    <div className="space-y-3 text-sm leading-7 text-muted pl-11">
                        <p>
                            Insynspersoner är personer med tillgång till icke-offentlig information om ett börsbolag —
                            typiskt VD, CFO, styrelseledamöter och andra i ledningsgruppen.
                            Enligt EU:s marknadsmissbruksförordning (MAR) och svensk lag är dessa personer
                            skyldiga att anmäla alla köp och försäljningar av aktier i det egna bolaget
                            till <strong className="text-ink font-medium">Finansinspektionen</strong> inom tre arbetsdagar.
                        </p>
                        <p>
                            Dessa anmälningar publiceras i ett offentligt register och är tillgängliga för alla.
                            AktieKoll hämtar och strukturerar denna data löpande och presenterar den på ett
                            lättöverskådligt sätt.
                        </p>
                    </div>
                </section>

                {/* Why it matters */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim">
                            <TrendingUp className="h-4 w-4 text-accent" />
                        </div>
                        <h2 className="font-display text-lg font-bold text-ink">Varför är det värdefullt?</h2>
                    </div>
                    <div className="space-y-3 text-sm leading-7 text-muted pl-11">
                        <p>
                            Ingen känner ett bolag bättre än dess egna ledning. När en VD eller styrelseordförande
                            väljer att köpa aktier i det egna bolaget med sina privata pengar är det ett starkt
                            signalvärde — de tror på framtiden.
                        </p>
                        <p>
                            Forskning visar att aktier där insiders köpt i stor volym historiskt sett presterat
                            bättre än index på 6–12 månaders sikt. Omvänt kan intensiva försäljningar vara
                            en signal om att insiders ser begränsad uppsida.
                        </p>
                        <p>
                            Det är viktigt att komma ihåg att insynsdata <em className="not-italic font-medium text-ink">inte</em> är
                            investeringsrådgivning. En insider kan sälja av personliga skäl — skatteplanering,
                            diversifiering eller likviditetsbehov — utan att det speglar synen på bolaget.
                            Använd alltid insynsdata som ett komplement till din övriga analys.
                        </p>
                    </div>
                </section>

                {/* Disclaimer */}
                <section className="rounded-xl border border-border bg-bg2 p-5 flex gap-4">
                    <Shield className="h-5 w-5 text-faint shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-ink">Inte finansiell rådgivning</p>
                        <p className="text-xs leading-relaxed text-muted">
                            Informationen på AktieKoll är enbart i informationssyfte och utgör inte
                            finansiell rådgivning eller investeringsrekommendationer.
                            All handel med värdepapper sker på eget ansvar.
                            Data hämtas från Finansinspektionens offentliga register och kan
                            innehålla förseningar eller felaktigheter.
                        </p>
                    </div>
                </section>

                {/* Features */}
                <section className="space-y-4">
                    <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">
                        Vad kan du göra med AktieKoll?
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {features.map(({ icon: Icon, title, body }) => (
                            <div key={title} className="rounded-xl border border-border bg-bg2 p-5 space-y-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim">
                                    <Icon className="h-4 w-4 text-accent" />
                                </div>
                                <h3 className="font-display text-sm font-semibold text-ink">{title}</h3>
                                <p className="text-xs leading-relaxed text-muted">{body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 font-display text-[13px] font-bold uppercase tracking-[0.06em] text-bg hover:opacity-90 transition-opacity"
                    >
                        Se senaste transaktionerna
                    </Link>
                    <Link
                        href="/auth"
                        className="inline-flex items-center justify-center rounded-xl border border-border bg-bg2 px-6 py-3 font-display text-[13px] font-bold uppercase tracking-[0.06em] text-muted hover:text-ink transition-colors"
                    >
                        Skapa gratis konto
                    </Link>
                </section>

            </div>
        </main>
    );
}
