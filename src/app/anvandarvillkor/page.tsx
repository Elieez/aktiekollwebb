import Link from "next/link";

export const metadata = {
    title: "Användarvillkor – AktieKoll",
};

export default function AnvandarvillkorPage() {
    return (
        <main className="min-h-screen bg-bg py-12 px-4">
            <div className="mx-auto max-w-2xl space-y-8">
                <div>
                    <Link href="/" className="text-xs text-faint hover:text-muted transition-colors">
                        ← Tillbaka
                    </Link>
                    <h1 className="font-display text-3xl font-bold text-ink mt-4">Användarvillkor</h1>
                    <p className="text-faint text-sm mt-1">Senast uppdaterad: mars 2026</p>
                </div>

                <div className="space-y-6 text-sm text-muted leading-relaxed">

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">1. Om tjänsten</h2>
                        <p>
                            AktieKoll är en informationstjänst som samlar och presenterar offentliga uppgifter om
                            insidertransaktioner på den svenska aktiemarknaden. Informationen hämtas från Finansinspektionens
                            officiella register och är avsedd enbart för informationsändamål.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">2. Inte finansiell rådgivning</h2>
                        <p>
                            Innehållet på AktieKoll utgör inte finansiell rådgivning, investeringsrekommendationer eller
                            uppmaningar att köpa eller sälja värdepapper. All information presenteras i informationssyfte.
                            Beslut om investeringar fattas alltid på eget ansvar.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">3. Konto</h2>
                        <p>
                            För att använda bevakningsfunktioner krävs ett konto. Du ansvarar för att hålla dina
                            inloggningsuppgifter konfidentiella och för all aktivitet som sker via ditt konto.
                            Du måste vara minst 18 år för att registrera ett konto.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">4. Tillåten användning</h2>
                        <p>Du får inte använda tjänsten för att:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>automatiserat hämta eller skrapa data i stor skala,</li>
                            <li>störa eller belasta tjänstens infrastruktur,</li>
                            <li>sprida vilseledande eller olagligt innehåll,</li>
                            <li>kringgå säkerhetsfunktioner eller åtkomstkontroller.</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">5. Datakällor och noggrannhet</h2>
                        <p>
                            Vi strävar efter att presentera korrekt och aktuell information, men garanterar inte att
                            uppgifterna är fullständiga, felfria eller uppdaterade i realtid. Avvikelser gentemot
                            Finansinspektionens officiella register kan förekomma.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">6. Ansvarsbegränsning</h2>
                        <p>
                            AktieKoll ansvarar inte för ekonomisk förlust eller skada som uppstår till följd av
                            användning av eller tillit till informationen på tjänsten. Tjänsten tillhandahålls i
                            befintligt skick utan garantier av något slag.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">7. Ändringar av villkoren</h2>
                        <p>
                            Vi förbehåller oss rätten att när som helst ändra dessa villkor. Vid väsentliga ändringar
                            meddelas registrerade användare via e-post. Fortsatt användning av tjänsten efter att
                            ändringarna trätt i kraft innebär att du accepterar de nya villkoren.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">8. Tillämplig lag</h2>
                        <p>
                            Dessa villkor regleras av svensk lag. Tvister ska i första hand lösas i samförstånd.
                            I annat fall ska svensk domstol äga behörighet.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">9. Kontakt</h2>
                        <p>
                            Har du frågor om dessa villkor är du välkommen att kontakta oss via e-post.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
