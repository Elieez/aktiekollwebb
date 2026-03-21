export default function Hero() {
    return (
    <div className="mx-auto flex max-w-380 animate-fadeUp items-end justify-between gap-6 border-b border-white/[0.07] px-8 pt-14 pb-10">
      {/* Copy */}
      <div>
        <h1 className="mb-2.5 font-display text-[clamp(28px,4vw,44px)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
          Spåra <em className="not-italic text-accent">insiderhandel</em>
          <br />
          på Stockholmsbörsen
        </h1>
        <p className="max-w-100 text-sm leading-7 text-muted">
          Realtidsdata om köp och säljtransaktioner gjorda av bolagsledningar och
          styrelsemedlemmar. Komplett öppenhet.
        </p>
      </div>
 
      {/* Stats */}
      <div className="flex shrink-0 gap-8">
        {[
          { val: "1 284", label: "Transaktioner i år" },
          { val: "342 M",  label: "Handelsvärde kr" },
          { val: "218",    label: "Aktiva bolag" },
        ].map((s) => (
          <div key={s.label} className="text-right">
            <span className="block font-display text-2xl font-semibold text-ink">
              {s.val}
            </span>
            <span className="text-[12px] uppercase tracking-widest text-[#666]">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}