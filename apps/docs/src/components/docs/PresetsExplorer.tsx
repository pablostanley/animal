"use client";

import * as React from "react";
import { ANIMAL_MANIFEST } from "@vercel/animal";
import { PresetPreview } from "@/components/PresetPreview";
import { CopyButton } from "@/components/CopyButton";

type PresetItem = (typeof ANIMAL_MANIFEST.presets)[number];
type Intensity = "default" | "sm" | "lg" | "xl" | "2xl";
const INTENSITIES: Intensity[] = ["default", "sm", "lg", "xl", "2xl"];

/** Strip intensity suffix to get the base animation name */
function getBaseName(name: string): string {
  return name.replace(/-(sm|lg|xl|2xl)$/, "");
}

/** Check if a preset name has an intensity suffix */
function getIntensity(name: string): Intensity {
  if (name.endsWith("-2xl")) return "2xl";
  if (name.endsWith("-xl")) return "xl";
  if (name.endsWith("-lg")) return "lg";
  if (name.endsWith("-sm")) return "sm";
  return "default";
}

type PresetGroup = {
  phase: string;
  baseName: string;
  variants: Partial<Record<Intensity, PresetItem>>;
};

function groupPresets(presets: PresetItem[]): PresetGroup[] {
  const map = new Map<string, PresetGroup>();

  for (const p of presets) {
    const baseName = getBaseName(p.name);
    const intensity = getIntensity(p.name);
    const key = `${p.phase}:${baseName}`;

    if (!map.has(key)) {
      map.set(key, { phase: p.phase, baseName, variants: {} });
    }
    map.get(key)!.variants[intensity] = p;
  }

  return Array.from(map.values());
}

function IntensityToggle({
  variants,
  active,
  onChange,
}: {
  variants: Partial<Record<Intensity, PresetItem>>;
  active: Intensity;
  onChange: (intensity: Intensity) => void;
}) {
  const available = INTENSITIES.filter((i) => variants[i]);
  if (available.length <= 1) return null;

  return (
    <div className="flex items-center gap-0.5">
      {available.map((intensity) => (
        <button
          key={intensity}
          type="button"
          onClick={() => onChange(intensity)}
          className={[
            "rounded px-2 py-1 font-mono text-[11px] font-medium transition-colors",
            intensity === active
              ? "bg-black/10 text-black dark:bg-white/15 dark:text-white"
              : "text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70",
          ].join(" ")}
          aria-label={`${intensity} intensity`}
          aria-pressed={intensity === active}
        >
          {intensity === "default" ? "base" : intensity}
        </button>
      ))}
    </div>
  );
}

export function PresetsExplorer() {
  const groups = React.useMemo(() => groupPresets(ANIMAL_MANIFEST.presets), []);

  const phaseGroups = React.useMemo(() => {
    const phases = ["enter", "exit", "hover", "press", "focus"] as const;
    return phases
      .map((phase) => ({
        phase,
        groups: groups.filter((g) => g.phase === phase),
      }))
      .filter((pg) => pg.groups.length > 0);
  }, [groups]);

  // Global intensity level
  const [intensity, setIntensity] = React.useState<Intensity>("default");

  // Selected group for the sticky preview
  const [selectedGroup, setSelectedGroup] = React.useState<PresetGroup>(groups[0]!);
  const [nonce, setNonce] = React.useState(0);

  // Resolve the active preset from group + global intensity
  const getActivePreset = (group: PresetGroup): PresetItem => {
    return group.variants[intensity] ?? group.variants.default!;
  };

  const selected = getActivePreset(selectedGroup);

  const handleRowClick = (group: PresetGroup) => {
    if (selectedGroup === group) {
      setNonce((n) => n + 1);
    } else {
      setSelectedGroup(group);
      setNonce((n) => n + 1);
    }
  };

  const handleIntensityChange = (newIntensity: Intensity) => {
    setIntensity(newIntensity);
    setNonce((n) => n + 1);
  };

  return (
    <div className="flex gap-8 lg:gap-10">
      {/* Left: preset list */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-8">
          {phaseGroups.map(({ phase, groups: phasePresets }) => (
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
                    {phasePresets.map((group) => {
                      const activePreset = getActivePreset(group);
                      const isSelected = selectedGroup === group;

                      return (
                        <tr
                          key={`${group.phase}:${group.baseName}`}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleRowClick(group)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleRowClick(group);
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
                              {`${activePreset.phase}:${activePreset.name}`}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-black/60 dark:text-white/60">
                            {activePreset.description}
                          </td>
                          <td className="hidden px-4 py-2.5 text-xs text-black/40 dark:text-white/40 sm:table-cell">
                            {activePreset.defaults.durationMs}ms, {activePreset.defaults.easing}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Right: sticky preview */}
      <div className="hidden w-72 shrink-0 lg:block xl:w-80">
        <div className="sticky top-20">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
              Preview
            </h2>
            <IntensityToggle
              variants={selectedGroup.variants}
              active={intensity}
              onChange={handleIntensityChange}
            />
          </div>
          <div className="mt-3">
            <PresetPreview
              key={`${selected.phase}:${selected.name}:${nonce}`}
              phase={selected.phase}
              name={selected.name}
              params={selected.params}
            />
          </div>

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
  );
}
