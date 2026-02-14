import { ANIMAL_MANIFEST } from "@vercel/animal";

export default function PresetsPage() {
  const groups = ANIMAL_MANIFEST.presets.reduce<Record<string, typeof ANIMAL_MANIFEST.presets>>((acc, p) => {
    (acc[p.phase] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">Presets</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
        Use the <code className="rounded bg-white/10 px-1.5 py-0.5">an</code> prop to apply preset tokens. Most presets
        are phase-scoped like <code className="rounded bg-white/10 px-1.5 py-0.5">hover:lift</code>.
      </p>

      <div className="mt-8 flex flex-col gap-10">
        {Object.entries(groups).map(([phase, presets]) => (
          <section key={phase}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
              {phase}
            </h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-black/5 text-black/70 dark:bg-white/5 dark:text-white/70">
                  <tr>
                    <th className="px-4 py-3 font-medium">Token</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Defaults</th>
                  </tr>
                </thead>
                <tbody>
                  {presets.map((p) => (
                    <tr key={`${p.phase}:${p.name}`} className="border-t border-black/10 dark:border-white/10">
                      <td className="px-4 py-3 font-mono text-xs text-black/80 dark:text-white/80">
                        {`${p.phase}:${p.name}`}
                      </td>
                      <td className="px-4 py-3 text-black/70 dark:text-white/70">{p.description}</td>
                      <td className="px-4 py-3 text-black/60 dark:text-white/60">
                        {p.defaults.durationMs}ms, {p.defaults.easing}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

