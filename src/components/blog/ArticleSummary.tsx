export function ArticleSummary({
  keyTakeaways,
  whyItMatters,
}: {
  keyTakeaways?: string[];
  whyItMatters?: string;
}) {
  if (!whyItMatters && (!keyTakeaways || keyTakeaways.length === 0)) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
        Resumo editorial
      </p>
      {whyItMatters ? (
        <p className="mt-4 text-base leading-7 text-stone-700">
          {whyItMatters}
        </p>
      ) : null}
      {keyTakeaways && keyTakeaways.length > 0 ? (
        <ul className="mt-5 divide-y divide-stone-100">
          {keyTakeaways.slice(0, 4).map((takeaway) => (
            <li key={takeaway} className="py-3 text-sm leading-6 text-stone-700 first:pt-0 last:pb-0">
              {takeaway}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
