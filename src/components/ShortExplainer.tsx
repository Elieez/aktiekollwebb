export default function ShortExplainer() {
  return (
    <div className="rounded-xl border border-border bg-bg2 px-4 py-3.5 card-shadow">
      <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">
        Vad är blankning?
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-ink">
        Att blanka en aktie innebär att man lånar aktier och säljer dem i förhoppning om att kunna
        köpa tillbaka dem billigare senare. Den som blankar tjänar alltså på att kursen faller.
        Stora blankningspositioner kan därför visa att marknaden tror på sämre utveckling, medan
        insiderköp kan peka åt motsatt håll.
      </p>
      <p className="mt-2 text-[12px] text-faint">
        Källa: Finansinspektionen. Positioner över 0,1 % ingår i summan; innehavare visas från 0,5 %.
      </p>
    </div>
  );
}
