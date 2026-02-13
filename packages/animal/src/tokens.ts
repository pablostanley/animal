import type { AnimalConfig, AnimalOptions, EasingName, PhaseConfig, PresetPhase } from "./types";
import { isKnownPreset } from "./presets";

const PHASES: readonly PresetPhase[] = ["enter", "exit", "hover", "press", "focus"];

function isPhase(value: string): value is PresetPhase {
  return (PHASES as readonly string[]).includes(value);
}

function ensurePhase(config: AnimalConfig, phase: PresetPhase): PhaseConfig {
  const current = config[phase];
  if (current) return current;
  const next: PhaseConfig = {};
  config[phase] = next;
  return next;
}

function ensureOptions(target: PhaseConfig | AnimalConfig): AnimalOptions {
  const current = target.options;
  if (current) return current;
  const next: AnimalOptions = {};
  target.options = next;
  return next;
}

function parseNumber(value: string): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function parseDurationToken(raw: string): number | null {
  const m = /^(?:duration|dur)-(\d+)$/.exec(raw);
  if (!m) return null;
  return parseNumber(m[1] ?? "");
}

function parseDelayToken(raw: string): number | null {
  const m = /^delay-(\d+)$/.exec(raw);
  if (!m) return null;
  return parseNumber(m[1] ?? "");
}

function parseParamToken(raw: string): { key: "x" | "y" | "scale"; value: number } | null {
  const m = /^(x|y|scale)-(-?\d+(?:\.\d+)?)$/.exec(raw);
  if (!m) return null;
  const key = m[1];
  if (key !== "x" && key !== "y" && key !== "scale") return null;
  const value = parseNumber(m[2] ?? "");
  if (value === null) return null;
  return { key, value };
}

function normalizeEasingToken(token: string): EasingName | null {
  const m = /^ease-(.+)$/.exec(token);
  if (!m) return null;

  const raw = m[1] ?? "";
  if (raw === "linear") return "linear";
  if (raw === "ease") return "ease";
  if (raw === "in") return "ease-in";
  if (raw === "out") return "ease-out";
  if (raw === "in-out") return "ease-in-out";
  if (raw.startsWith("spring-")) return raw as EasingName;

  return null;
}

function normalizeReducedMotionToken(token: string): AnimalOptions["reducedMotion"] | null {
  if (token === "rm-system") return "system";
  if (token === "rm-always") return "always";
  if (token === "rm-never") return "never";
  return null;
}

export function parseAnimalTokens(an: string | undefined): AnimalConfig {
  const config: AnimalConfig = {};
  if (!an) return config;

  const tokens = an
    .split(/\s+/g)
    .map((t) => t.trim())
    .filter(Boolean);

  const unknown: string[] = [];

  for (const token of tokens) {
    let phase: PresetPhase | undefined;
    let raw = token;

    const colonIdx = token.indexOf(":");
    if (colonIdx > 0) {
      const maybePhase = token.slice(0, colonIdx);
      const rest = token.slice(colonIdx + 1);
      if (isPhase(maybePhase)) {
        phase = maybePhase;
        raw = rest;
      }
    }

    // Global-only tokens
    const reducedMotion = normalizeReducedMotionToken(raw);
    if (reducedMotion) {
      ensureOptions(config).reducedMotion = reducedMotion;
      continue;
    }

    // Phase-scoped tokens (or fall back to global).
    const target = phase ? ensurePhase(config, phase) : undefined;
    const optTarget = target ? ensureOptions(target) : ensureOptions(config);

    const duration = parseDurationToken(raw);
    if (duration !== null) {
      optTarget.duration = duration;
      continue;
    }

    const delay = parseDelayToken(raw);
    if (delay !== null) {
      optTarget.delay = delay;
      continue;
    }

    const easing = normalizeEasingToken(raw);
    if (easing) {
      optTarget.easing = easing;
      continue;
    }

    const param = parseParamToken(raw);
    if (param) {
      const p = ensurePhase(config, phase ?? "enter");
      p.params = { ...(p.params ?? {}), [param.key]: param.value };
      continue;
    }

    // Presets: unprefixed preset defaults to enter (agent-friendly).
    if (phase) {
      if (isKnownPreset(phase, raw)) {
        target!.preset = raw;
        continue;
      }
    } else {
      if (isKnownPreset("enter", raw)) {
        ensurePhase(config, "enter").preset = raw;
        continue;
      }
    }

    unknown.push(token);
  }

  if (unknown.length > 0) config.unknownTokens = unknown;
  return config;
}

