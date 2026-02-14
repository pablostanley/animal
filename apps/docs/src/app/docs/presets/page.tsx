"use client";

import * as React from "react";
import { ANIMAL_MANIFEST } from "@vercel/animal";
import { PresetPreview } from "../../../components/PresetPreview";
import { CopyButton } from "../../../components/CopyButton";

type PresetItem = (typeof ANIMAL_MANIFEST.presets)[number];

export default function PresetsPage() {
  const groups = React.useMemo(
    () =>
      ANIMAL_MANIFEST.presets.reduce<Record<string, PresetItem[]>>((acc, p) => {
        (acc[p.phase] ??= []).push(p);
        return acc;
      }, {}),
    []
  );

  const [selected, setSelected] = React.useState<PresetItem>(ANIMAL_MANIFEST.presets[0]!);
  const [nonce, setNonce] = React.useState(0);

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
          Presets
        </h1>
        <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">
          {ANIMAL_MANIFEST.presets.length} animation presets across 5 phases. Click any row to
          preview it.
        </p>
      </div>

      <div className="flex gap-8 lg:gap-10">
        {/* Left: preset list */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-8">
            {(["enter", "exit", "hover", "press", "focus"] as const).map((phase) => {
              const presets = groups[phase];
              if (!presets?.length) return null;
              return (
                <section key={phase}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
                    {phase}
                  </h2>
                  <div className="mt-3 overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="bg-black/5 text-black/70 dark:bg-white/5 dark:text-white/70">
                        <tr>
                          <th className="px-4 py-2.5 font-medium">Token</th>
                          <th className="px-4 py-2.5 font-medium">Description</th>
                          <th className="hidden px-4 py-2.5 font-medium sm:table-cell">
                            Defaults
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {presets.map((p) => {
                          const isSelected =
                            selected.phase === p.phase && selected.name === p.name;
                          return (
                            <tr
                              key={`${p.phase}:${p.name}`}
                              onClick={() => {
                              if (selected.phase === p.phase && selected.name === p.name) {
                                setNonce((n) => n + 1);
                              } else {
                                setSelected(p);
                                setNonce((n) => n + 1);
                              }
                            }}
                              className={[
                                "cursor-pointer border-t border-black/10 transition-colors dark:border-white/10",
                                isSelected
                                  ? "bg-black/[0.08] dark:bg-white/[0.08]"
                                  : "hover:bg-black/[0.03] dark:hover:bg-white/[0.03]",
                              ].join(" ")}
                            >
                              <td className="px-4 py-2.5">
                                <span
                                  className={[
                                    "inline-flex items-center gap-2 font-mono text-xs",
                                    isSelected
                                      ? "text-black dark:text-white"
                                      : "text-black/70 dark:text-white/70",
                                  ].join(" ")}
                                >
                                  {isSelected && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-black dark:bg-white" />
                                  )}
                                  {`${p.phase}:${p.name}`}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 text-black/60 dark:text-white/60">
                                {p.description}
                              </td>
                              <td className="hidden px-4 py-2.5 text-xs text-black/40 dark:text-white/40 sm:table-cell">
                                {p.defaults.durationMs}ms, {p.defaults.easing}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        {/* Right: sticky preview */}
        <div className="hidden w-72 shrink-0 lg:block xl:w-80">
          <div className="sticky top-20">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
              Preview
            </h2>
            <div className="mt-3">
              <PresetPreview
                key={`${selected.phase}:${selected.name}:${nonce}`}
                phase={selected.phase}
                name={selected.name}
                params={selected.params}
              />
            </div>

            {/* Params info */}
            {Object.keys(selected.params).length > 0 && (
              <div className="mt-4 rounded-xl border border-black/10 p-3 dark:border-white/10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
                  Parameters
                </p>
                <div className="mt-2 flex flex-col gap-1">
                  {(
                    Object.entries(selected.params) as Array<
                      [string, { default: number; unit: string; description: string }]
                    >
                  ).map(([key, val]) => (
                    <div
                      key={key}
                      className="flex items-baseline justify-between gap-2 text-xs"
                    >
                      <code className="text-black/70 dark:text-white/70">{key}</code>
                      <span className="text-black/40 dark:text-white/40">
                        {val.default}
                        {val.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Code example */}
            <div className="mt-4 rounded-xl border border-black/10 bg-black/[0.03] p-3 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-start justify-between gap-2">
                <pre className="min-w-0 flex-1 overflow-auto text-xs text-black/60 dark:text-white/60">
                  <code>{selected.codeExample}</code>
                </pre>
                <CopyButton text={selected.codeExample} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
