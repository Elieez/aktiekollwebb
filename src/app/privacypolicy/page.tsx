import Link from "next/link";

export const metadata = {
    title: "Integritetspolicy – AktieKoll",
};

export default function IntegritetspolicyPage() {
    return (
        <main className="min-h-screen bg-bg py-12 px-4">
            <div className="mx-auto max-w-2xl space-y-8">
                <div>
                    <Link href="/" className="text-xs text-faint hover:text-muted transition-colors">
                        ← Tillbaka
                    </Link>
                    <h1 className="font-display text-3xl font-bold text-ink mt-4">Integritetspolicy</h1>
                    <p className="text-faint text-sm mt-1">Senast uppdaterad: mars 2026</p>
                </div>

                <div className="space-y-6 text-sm text-muted leading-relaxed">

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">1. Personuppgiftsansvarig</h2>
                        <p>
                            AktieKoll är personuppgiftsansvarig för behandlingen av dina personuppgifter i enlighet
                            med EU:s dataskyddsförordning (GDPR).
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">2. Uppgifter vi samlar in</h2>
                        <p>Vi samlar in följande uppgifter när du skapar ett konto eller använder tjänsten:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li><span className="text-ink font-medium">E-postadress</span> – för inloggning och notifikationer.</li>
                            <li><span className="text-ink font-medium">Visningsnamn</span> – valfritt, används i gränssnittet.</li>
                            <li><span className="text-ink font-medium">Google-profilinformation</span> – om du väljer att logga in via Google (namn och profilbild).</li>
                            <li><span className="text-ink font-medium">Bevakningslista</span> – vilka bolag du valt att bevaka.</li>
                            <li><span className="text-ink font-medium">Notifikationsinställningar</span> – dina preferenser för e-post och Discord.</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">3. Syfte och rättslig grund</h2>
                        <p>Vi behandlar dina uppgifter för att:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>tillhandahålla och förbättra tjänsten (berättigat intresse / avtal),</li>
                            <li>skicka notifikationer om insidertransaktioner du valt att bevaka (samtycke),</li>
                            <li>skydda tjänsten mot missbruk (berättigat intresse).</li>
                        </ul>
                    </section>
 
                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">4. Lagring och säkerhet</h2>
                        <p>
                            Dina uppgifter lagras på säkra servrar inom EU. Lösenord lagras aldrig i klartext utan
                            krypteras med en erkänd hashalgoritm. Vi vidtar tekniska och organisatoriska åtgärder för
                            att skydda dina uppgifter mot obehörig åtkomst.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">5. Delning med tredje part</h2>
                        <p>
                            Vi säljer aldrig dina personuppgifter. Vi delar uppgifter med tredje part endast i den
                            utsträckning det krävs för att driva tjänsten, exempelvis hosting-leverantörer och
                            e-posttjänster, vilka behandlar data enligt GDPR och våra instruktioner.
                        </p>
                        <p>
                            Om du väljer att använda Discord-notifikationer skickas information till din angivna
                            Discord-webhook. AktieKoll ansvarar inte för Discords hantering av dessa uppgifter.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">6. Dina rättigheter</h2>
                        <p>Enligt GDPR har du rätt att:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li><span className="text-ink font-medium">Begära tillgång</span> till de uppgifter vi har om dig.</li>
                            <li><span className="text-ink font-medium">Rätta</span> felaktiga uppgifter.</li>
                            <li><span className="text-ink font-medium">Radera</span> ditt konto och alla tillhörande uppgifter (se Inställningar → Radera konto).</li>
                            <li><span className="text-ink font-medium">Invända</span> mot viss behandling eller begära begränsning.</li>
                            <li><span className="text-ink font-medium">Dataportabilitet</span> – begära ut dina uppgifter i ett strukturerat format.</li>
                        </ul>
                        <p>
                            För att utöva dina rättigheter kontaktar du oss via e-post. Vi svarar inom 30 dagar.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">7. Lagringstid</h2>
                        <p>
                            Vi sparar dina uppgifter så länge ditt konto är aktivt. När du raderar ditt konto
                            raderas alla personuppgifter utan onödigt dröjsmål, senast inom 30 dagar.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">8. Cookies</h2>
                        <p>
                            Tjänsten använder en httpOnly-cookie för att hantera inloggningssessioner. Inga
                            spårningscookies eller reklamcookies används.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">9. Klagomål</h2>
                        <p>
                            Om du anser att vi behandlar dina personuppgifter felaktigt har du rätt att lämna
                            klagomål till Integritetsskyddsmyndigheten (IMY) på{" "}
                            <span className="text-ink">imy.se</span>.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-display text-base font-semibold text-ink">10. Kontakt</h2>
                        <p>
                            Frågor om vår integritetspolicy besvaras via e-post.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
