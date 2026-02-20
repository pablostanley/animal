"use client";

import * as React from "react";
import { ANIMAL_MANIFEST } from "@vercel/animal";
import { A, Presence } from "@vercel/animal/react";
import { CopyButton } from "./CopyButton";
import { CodeBlock } from "./CodeBlock";

// ─── Types & Constants ─────────────────────────────────────────────────────────

type PresetPhase = "enter" | "exit" | "hover" | "press" | "focus";
type ElementShape = "square" | "circle" | "button" | "card";
type PresetItem = (typeof ANIMAL_MANIFEST.presets)[number];

const PHASES: PresetPhase[] = ["enter", "exit", "hover", "press", "focus"];

const EASES = [
  { group: "css" as const, label: "ease", token: "ease" },
  { group: "css" as const, label: "linear", token: "ease-linear" },
  { group: "css" as const, label: "in", token: "ease-in" },
  { group: "css" as const, label: "out", token: "ease-out" },
  { group: "css" as const, label: "in-out", token: "ease-in-out" },
  { group: "spring" as const, label: "default", token: "ease-spring-default" },
  { group: "spring" as const, label: "snappy", token: "ease-spring-snappy" },
  { group: "spring" as const, label: "bouncy", token: "ease-spring-bouncy" },
  { group: "spring" as const, label: "strong", token: "ease-spring-strong" },
];

const SHAPES: { value: ElementShape; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "circle", label: "Circle" },
  { value: "button", label: "Button" },
  { value: "card", label: "Card" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

const basePresetsCache = new Map<PresetPhase, PresetItem[]>();
function getBasePresets(phase: PresetPhase): PresetItem[] {
  if (basePresetsCache.has(phase)) return basePresetsCache.get(phase)!;
  const result = ANIMAL_MANIFEST.presets.filter(
    (p) => p.phase === phase && !/-(?:sm|lg|xl|2xl)$/.test(p.name),
  );
  basePresetsCache.set(phase, result);
  return result;
}

function sliderConfig(key: string) {
  if (key === "scale") return { min: 0.1, max: 2.0, step: 0.05 };
  if (key === "rotate") return { min: 0, max: 360, step: 1 };
  return { min: 0, max: 200, step: 1 };
}

function easingNameToToken(name: string): string {
  if (name === "ease") return "ease";
  if (name === "linear") return "ease-linear";
  if (name.startsWith("ease-")) return name;
  return `ease-${name}`;
}

function findManifestPreset(phase: PresetPhase, name: string | null): PresetItem | undefined {
  if (!name) return undefined;
  return ANIMAL_MANIFEST.presets.find((p) => p.phase === phase && p.name === name);
}

// ─── State ──────────────────────────────────────────────────────────────────────

type PhaseState = {
  preset: string | null;
  duration: number | null;
  delay: number | null;
  easing: string | null;
  params: Record<string, number>;
};

type ComposerState = {
  phases: Record<PresetPhase, PhaseState>;
  loop: null | true | number;
  inView: "off" | "once" | "repeat";
  reducedMotion: "system" | "always" | "never";
  activeTab: PresetPhase;
  elementShape: ElementShape;
  present: boolean;
  nonce: number;
};

type Action =
  | { type: "SET_PRESET"; phase: PresetPhase; preset: string | null }
  | { type: "SET_DURATION"; phase: PresetPhase; value: number | null }
  | { type: "SET_DELAY"; phase: PresetPhase; value: number | null }
  | { type: "SET_EASING"; phase: PresetPhase; value: string | null }
  | { type: "SET_PARAM"; phase: PresetPhase; key: string; value: number }
  | { type: "SET_TAB"; tab: PresetPhase }
  | { type: "SET_SHAPE"; shape: ElementShape }
  | { type: "SET_LOOP"; value: null | true | number }
  | { type: "SET_IN_VIEW"; value: "off" | "once" | "repeat" }
  | { type: "SET_REDUCED_MOTION"; value: "system" | "always" | "never" }
  | { type: "SET_PRESENT"; value: boolean }
  | { type: "TOGGLE_PRESENT" }
  | { type: "REPLAY" };

function emptyPhase(): PhaseState {
  return { preset: null, duration: null, delay: null, easing: null, params: {} };
}

function initState(): ComposerState {
  return {
    phases: { enter: emptyPhase(), exit: emptyPhase(), hover: emptyPhase(), press: emptyPhase(), focus: emptyPhase() },
    loop: null,
    inView: "off",
    reducedMotion: "system",
    activeTab: "enter",
    elementShape: "square",
    present: true,
    nonce: 0,
  };
}

function reducer(state: ComposerState, action: Action): ComposerState {
  switch (action.type) {
    case "SET_PRESET": {
      const mp = findManifestPreset(action.phase, action.preset);
      const params: Record<string, number> = {};
      if (mp?.params) {
        for (const [k, v] of Object.entries(mp.params)) {
          if (v) params[k] = v.default;
        }
      }
      const isEnterExit = action.phase === "enter" || action.phase === "exit";
      return {
        ...state,
        phases: {
          ...state.phases,
          [action.phase]: { preset: action.preset, duration: null, delay: null, easing: null, params },
        },
        ...(isEnterExit ? { nonce: state.nonce + 1, present: true } : {}),
      };
    }
    case "SET_DURATION":
      return { ...state, phases: { ...state.phases, [action.phase]: { ...state.phases[action.phase], duration: action.value } } };
    case "SET_DELAY":
      return { ...state, phases: { ...state.phases, [action.phase]: { ...state.phases[action.phase], delay: action.value } } };
    case "SET_EASING":
      return { ...state, phases: { ...state.phases, [action.phase]: { ...state.phases[action.phase], easing: action.value } } };
    case "SET_PARAM":
      return {
        ...state,
        phases: {
          ...state.phases,
          [action.phase]: {
            ...state.phases[action.phase],
            params: { ...state.phases[action.phase].params, [action.key]: action.value },
          },
        },
      };
    case "SET_TAB":
      return { ...state, activeTab: action.tab };
    case "SET_SHAPE":
      return { ...state, elementShape: action.shape };
    case "SET_LOOP":
      return { ...state, loop: action.value };
    case "SET_IN_VIEW":
      return { ...state, inView: action.value };
    case "SET_REDUCED_MOTION":
      return { ...state, reducedMotion: action.value };
    case "SET_PRESENT":
      return { ...state, present: action.value };
    case "TOGGLE_PRESENT":
      return { ...state, present: !state.present };
    case "REPLAY":
      return { ...state, present: true, nonce: state.nonce + 1 };
    default:
      return state;
  }
}

// ─── Token Builder ──────────────────────────────────────────────────────────────

function buildTokenString(state: ComposerState, opts?: { preview?: boolean }): string {
  const parts: string[] = [];
  for (const phase of PHASES) {
    const ps = state.phases[phase];
    if (!ps.preset) continue;
    parts.push(`${phase}:${ps.preset}`);
    const mp = findManifestPreset(phase, ps.preset);
    if (mp?.params) {
      for (const [key, meta] of Object.entries(mp.params)) {
        if (meta && ps.params[key] !== undefined && ps.params[key] !== meta.default) {
          parts.push(`${phase}:${key}-${ps.params[key]}`);
        }
      }
    }
    if (ps.duration !== null && ps.duration !== mp?.defaults.durationMs) {
      parts.push(`${phase}:duration-${ps.duration}`);
    }
    if (ps.delay !== null && ps.delay !== (mp?.defaults.delayMs ?? 0)) {
      parts.push(`${phase}:delay-${ps.delay}`);
    }
    if (ps.easing !== null) {
      const defaultToken = mp ? easingNameToToken(mp.defaults.easing) : null;
      if (ps.easing !== defaultToken) parts.push(`${phase}:${ps.easing}`);
    }
  }
  if (state.loop === true) parts.push("loop");
  else if (typeof state.loop === "number") parts.push(`loop-${state.loop}`);
  if (!opts?.preview) {
    if (state.inView === "once") parts.push("in-view");
    else if (state.inView === "repeat") parts.push("in-view-repeat");
    if (state.reducedMotion !== "system") parts.push(`rm-${state.reducedMotion}`);
  }
  return parts.join(" ");
}

function buildExportCode(state: ComposerState, token: string): string {
  const hasEnterExit = !!(state.phases.enter.preset || state.phases.exit.preset);
  const tag = state.elementShape === "button" ? "button" : "div";
  const anAttr = `an="${token}"`;
  const el = tag === "button" ? `<A.${tag} ${anAttr}>Click me</A.${tag}>` : `<A.${tag} ${anAttr} />`;

  if (hasEnterExit) {
    return [
      `import { A, Presence } from "@vercel/animal/react";`,
      ``,
      `export function Example() {`,
      `  const [open, setOpen] = React.useState(true);`,
      ``,
      `  return (`,
      `    <Presence present={open}>`,
      `      ${el}`,
      `    </Presence>`,
      `  );`,
      `}`,
    ].join("\n");
  }

  return [
    `import { A } from "@vercel/animal/react";`,
    ``,
    `export function Example() {`,
    `  return ${el};`,
    `}`,
  ].join("\n");
}

// ─── Shared Styles ──────────────────────────────────────────────────────────────

const LABEL = "text-xs font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60";

const PILL =
  "rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30";
const PILL_OFF = `${PILL} border border-black/10 text-black/60 hover:bg-black/5 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/5`;
const PILL_ON = `${PILL} bg-black text-white dark:bg-white dark:text-black`;

const BTN =
  "h-8 rounded-lg border border-black/10 bg-black/[0.03] px-3 text-xs font-medium text-black/70 hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70 dark:hover:bg-white/[0.06] dark:focus-visible:ring-white/30";

const SLIDER =
  "h-1 w-full cursor-pointer appearance-none rounded-full bg-black/10 accent-black/70 dark:bg-white/10 dark:accent-white/70 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black/70 dark:[&::-webkit-slider-thumb]:bg-white/70";

// ─── Component ──────────────────────────────────────────────────────────────────

export function Playground() {
  const [state, dispatch] = React.useReducer(reducer, undefined, initState);
  const exitTimerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const activePhase = state.phases[state.activeTab];
  const activeManifest = findManifestPreset(state.activeTab, activePhase.preset);
  const hasEnterExit = !!(state.phases.enter.preset || state.phases.exit.preset);
  const hasEnter = !!state.phases.enter.preset;
  const hasExit = !!state.phases.exit.preset;
  const anyPreset = PHASES.some((p) => !!state.phases[p].preset);

  const exportToken = React.useMemo(() => buildTokenString(state), [state]);
  const previewToken = React.useMemo(() => buildTokenString(state, { preview: true }), [state]);
  const exportCode = React.useMemo(() => buildExportCode(state, exportToken), [state, exportToken]);

  const handleReplay = React.useCallback(() => {
    clearTimeout(exitTimerRef.current);
    dispatch({ type: "SET_PRESENT", value: false });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        dispatch({ type: "REPLAY" });
        if (hasExit && !hasEnter) {
          exitTimerRef.current = setTimeout(() => dispatch({ type: "SET_PRESENT", value: false }), 100);
        }
      });
    });
  }, [hasEnter, hasExit]);

  React.useEffect(() => () => clearTimeout(exitTimerRef.current), []);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">Animation Composer</h1>
        <p className="max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Combine presets across enter, exit, hover, press, and focus phases. Tweak every parameter and copy the{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">an</code> token.
        </p>
      </div>

      {/* Two-panel layout */}
      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* ─── Left Panel ─── */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-20 lg:w-5/12 lg:shrink-0 lg:self-start">
          {/* Live Preview */}
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.03]">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, rgba(128,128,128,0.25) 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            />
            {anyPreset ? (
              <Presence present={state.present} key={state.nonce}>
                <PreviewElement shape={state.elementShape} an={previewToken} />
              </Presence>
            ) : (
              <p className="text-sm text-black/30 dark:text-white/30">Select a preset to begin</p>
            )}
          </div>

          {/* Controls row: Toggle / Replay / Shape */}
          <div className="flex flex-wrap items-center gap-2">
            {hasEnterExit && (
              <>
                <button type="button" onClick={() => dispatch({ type: "TOGGLE_PRESENT" })} className={BTN}>
                  {state.present ? "Hide" : "Show"}
                </button>
                <button type="button" onClick={handleReplay} className={BTN}>
                  Replay
                </button>
              </>
            )}
            <div className="ml-auto flex items-center gap-1">
              {SHAPES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => dispatch({ type: "SET_SHAPE", shape: s.value })}
                  aria-pressed={state.elementShape === s.value}
                  className={state.elementShape === s.value ? PILL_ON : PILL_OFF}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Token display */}
          <div className="flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-xl border border-black/10 bg-black/5 px-3 py-2 font-mono text-xs text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
              {exportToken ? `an="${exportToken}"` : 'an=""'}
            </code>
            <CopyButton text={exportToken ? `an="${exportToken}"` : 'an=""'} />
          </div>

          {/* Code export */}
          <CodeBlock lang="tsx" code={exportCode} />
        </div>

        {/* ─── Right Panel ─── */}
        <div className="min-w-0 flex-1">
          {/* Phase Tabs */}
          <div role="tablist" className="flex gap-1 border-b border-black/10 pb-px dark:border-white/10">
            {PHASES.map((phase) => {
              const isActive = state.activeTab === phase;
              const hasPreset = !!state.phases[phase].preset;
              return (
                <button
                  key={phase}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => dispatch({ type: "SET_TAB", tab: phase })}
                  className={[
                    "relative flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30",
                    isActive
                      ? "bg-black/[0.06] text-black dark:bg-white/[0.06] dark:text-white"
                      : "text-black/50 hover:text-black/70 dark:text-white/50 dark:hover:text-white/70",
                  ].join(" ")}
                >
                  {phase.charAt(0).toUpperCase() + phase.slice(1)}
                  {hasPreset && (
                    <span className="h-1.5 w-1.5 rounded-full bg-black dark:bg-white" aria-label="has preset" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Preset Picker */}
          <div className="mt-5">
            <h3 className={LABEL}>Preset</h3>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <button
                type="button"
                aria-pressed={activePhase.preset === null}
                onClick={() => dispatch({ type: "SET_PRESET", phase: state.activeTab, preset: null })}
                className={activePhase.preset === null ? PILL_ON : PILL_OFF}
              >
                none
              </button>
              {getBasePresets(state.activeTab).map((p) => (
                <button
                  key={p.name}
                  type="button"
                  aria-pressed={activePhase.preset === p.name}
                  onClick={() => dispatch({ type: "SET_PRESET", phase: state.activeTab, preset: p.name })}
                  className={activePhase.preset === p.name ? PILL_ON : PILL_OFF}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Parameter Controls */}
          {activePhase.preset && (
            <div className="mt-6 flex flex-col gap-5">
              {/* Duration */}
              <label className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <span className={LABEL}>Duration</span>
                  <span className="text-[11px] tabular-nums text-black/50 dark:text-white/50">
                    {activePhase.duration ?? activeManifest?.defaults.durationMs ?? 360}ms
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={10}
                  value={activePhase.duration ?? activeManifest?.defaults.durationMs ?? 360}
                  onChange={(e) =>
                    dispatch({ type: "SET_DURATION", phase: state.activeTab, value: Number(e.target.value) })
                  }
                  className={SLIDER}
                />
              </label>

              {/* Delay */}
              <label className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <span className={LABEL}>Delay</span>
                  <span className="text-[11px] tabular-nums text-black/50 dark:text-white/50">
                    {activePhase.delay ?? activeManifest?.defaults.delayMs ?? 0}ms
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={10}
                  value={activePhase.delay ?? activeManifest?.defaults.delayMs ?? 0}
                  onChange={(e) =>
                    dispatch({ type: "SET_DELAY", phase: state.activeTab, value: Number(e.target.value) })
                  }
                  className={SLIDER}
                />
              </label>

              {/* Easing */}
              <div className="flex flex-col gap-2">
                <span className={LABEL}>Easing</span>
                <EasingPicker
                  selected={
                    activePhase.easing ??
                    (activeManifest ? easingNameToToken(activeManifest.defaults.easing) : "ease-spring-default")
                  }
                  defaultToken={
                    activeManifest ? easingNameToToken(activeManifest.defaults.easing) : "ease-spring-default"
                  }
                  onSelect={(token) =>
                    dispatch({ type: "SET_EASING", phase: state.activeTab, value: token })
                  }
                />
              </div>

              {/* Preset-specific params */}
              {activeManifest?.params && Object.keys(activeManifest.params).length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className={LABEL}>Parameters</span>
                  {Object.entries(activeManifest.params).map(([key, meta]) => {
                    if (!meta) return null;
                    const cfg = sliderConfig(key);
                    const val = activePhase.params[key] ?? meta.default;
                    return (
                      <label key={key} className="flex flex-col gap-1.5">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[11px] font-medium text-black/70 dark:text-white/70">{key}</span>
                          <span className="text-[11px] tabular-nums text-black/50 dark:text-white/50">
                            {val}
                            {meta.unit === "px" ? "px" : meta.unit === "deg" ? "deg" : ""}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={cfg.min}
                          max={cfg.max}
                          step={cfg.step}
                          value={val}
                          onChange={(e) =>
                            dispatch({
                              type: "SET_PARAM",
                              phase: state.activeTab,
                              key,
                              value: Number(e.target.value),
                            })
                          }
                          className={SLIDER}
                        />
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Global Options */}
          <details className="group mt-8 rounded-xl border border-black/10 dark:border-white/10">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-black/70 dark:text-white/70 [&::-webkit-details-marker]:hidden">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 transition-transform group-open:rotate-90"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              Global Options
            </summary>
            <div className="flex flex-col gap-5 border-t border-black/10 px-4 py-4 dark:border-white/10">
              {/* Loop */}
              <div className="flex flex-col gap-2">
                <span className={LABEL}>Loop</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-pressed={state.loop === null}
                    onClick={() => dispatch({ type: "SET_LOOP", value: null })}
                    className={state.loop === null ? PILL_ON : PILL_OFF}
                  >
                    Off
                  </button>
                  <button
                    type="button"
                    aria-pressed={state.loop === true}
                    onClick={() => dispatch({ type: "SET_LOOP", value: true })}
                    className={state.loop === true ? PILL_ON : PILL_OFF}
                  >
                    Infinite
                  </button>
                  <button
                    type="button"
                    aria-pressed={typeof state.loop === "number"}
                    onClick={() => dispatch({ type: "SET_LOOP", value: 3 })}
                    className={typeof state.loop === "number" ? PILL_ON : PILL_OFF}
                  >
                    Count
                  </button>
                  {typeof state.loop === "number" && (
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={state.loop}
                      onChange={(e) => {
                        const v = Math.max(1, Math.min(100, Number(e.target.value) || 1));
                        dispatch({ type: "SET_LOOP", value: v });
                      }}
                      className="h-7 w-16 rounded-lg border border-black/10 bg-transparent px-2 text-center text-xs tabular-nums text-black/70 dark:border-white/10 dark:text-white/70"
                    />
                  )}
                </div>
              </div>

              {/* In View */}
              <div className="flex flex-col gap-2">
                <span className={LABEL}>In View</span>
                <div className="flex items-center gap-1.5">
                  {(["off", "once", "repeat"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={state.inView === v}
                      onClick={() => dispatch({ type: "SET_IN_VIEW", value: v })}
                      className={state.inView === v ? PILL_ON : PILL_OFF}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reduced Motion */}
              <div className="flex flex-col gap-2">
                <span className={LABEL}>Reduced Motion</span>
                <div className="flex items-center gap-1.5">
                  {(["system", "always", "never"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={state.reducedMotion === v}
                      onClick={() => dispatch({ type: "SET_REDUCED_MOTION", value: v })}
                      className={state.reducedMotion === v ? PILL_ON : PILL_OFF}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function EasingPicker({
  selected,
  defaultToken,
  onSelect,
}: {
  selected: string;
  defaultToken: string;
  onSelect: (token: string | null) => void;
}) {
  const cssEases = EASES.filter((e) => e.group === "css");
  const springEases = EASES.filter((e) => e.group === "spring");

  const handleClick = (token: string) => {
    onSelect(token === defaultToken ? null : token);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        <span className="self-center text-[10px] font-medium uppercase text-black/30 dark:text-white/30">CSS</span>
        {cssEases.map((e) => (
          <button
            key={e.token}
            type="button"
            aria-pressed={selected === e.token}
            onClick={() => handleClick(e.token)}
            className={selected === e.token ? PILL_ON : PILL_OFF}
          >
            {e.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className="self-center text-[10px] font-medium uppercase text-black/30 dark:text-white/30">Spring</span>
        {springEases.map((e) => (
          <button
            key={e.token}
            type="button"
            aria-pressed={selected === e.token}
            onClick={() => handleClick(e.token)}
            className={selected === e.token ? PILL_ON : PILL_OFF}
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PreviewElement({ shape, an }: { shape: ElementShape; an: string }) {
  const base =
    "relative z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 dark:focus-visible:ring-white/30";

  switch (shape) {
    case "square":
      return (
        <A.div
          an={an}
          tabIndex={0}
          className={`${base} h-20 w-20 rounded-2xl bg-gradient-to-br from-black to-black/80 shadow-lg dark:from-white dark:to-white/80`}
        />
      );
    case "circle":
      return (
        <A.div
          an={an}
          tabIndex={0}
          className={`${base} h-20 w-20 rounded-full bg-gradient-to-br from-black to-black/80 shadow-lg dark:from-white dark:to-white/80`}
        />
      );
    case "button":
      return (
        <A.button
          an={an}
          className={`${base} rounded-xl bg-black px-6 py-3 text-sm font-medium text-white shadow-lg dark:bg-white dark:text-black`}
        >
          Click me
        </A.button>
      );
    case "card":
      return (
        <A.div
          an={an}
          tabIndex={0}
          className={`${base} w-36 rounded-2xl border border-black/10 bg-white p-4 shadow-lg dark:border-white/10 dark:bg-white/10`}
        >
          <div className="h-3 w-16 rounded-full bg-black/20 dark:bg-white/20" />
          <div className="mt-2 h-2 w-12 rounded-full bg-black/10 dark:bg-white/10" />
          <div className="mt-1.5 h-2 w-20 rounded-full bg-black/10 dark:bg-white/10" />
        </A.div>
      );
  }
}
