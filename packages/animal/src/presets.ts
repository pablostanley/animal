import type {
  EasingName,
  PartialMotionState,
  PresetManifestItem,
  PresetParams,
  PresetPhase,
} from "./types";

type PresetSpec = Readonly<{
  phase: PresetPhase;
  name: string;
  description: string;
  affects: PresetManifestItem["affects"];
  defaults: PresetManifestItem["defaults"];
  params: PresetManifestItem["params"];
  resolve: (params: Required<PresetParams>) => Readonly<{
    fromDelta?: PartialMotionState;
    toDelta?: PartialMotionState;
  }>;
}>;

const pxParam = (def: number, description: string) => ({ default: def, unit: "px" as const, description });
const scaleParam = (def: number, description: string) => ({
  default: def,
  unit: "ratio" as const,
  description,
});

const ENTER_DEFAULTS: PresetManifestItem["defaults"] = {
  durationMs: 360,
  delayMs: 0,
  easing: "spring-default",
};

const EXIT_DEFAULTS: PresetManifestItem["defaults"] = {
  durationMs: 240,
  delayMs: 0,
  easing: "ease-in-out",
};

const HOVER_DEFAULTS: PresetManifestItem["defaults"] = {
  durationMs: 180,
  delayMs: 0,
  easing: "ease-out",
};

const PRESS_DEFAULTS: PresetManifestItem["defaults"] = {
  durationMs: 120,
  delayMs: 0,
  easing: "ease-out",
};

const FOCUS_DEFAULTS: PresetManifestItem["defaults"] = {
  durationMs: 180,
  delayMs: 0,
  easing: "ease-out",
};

function withDefaults(params: PresetParams | undefined, defaults: Required<PresetParams>): Required<PresetParams> {
  return {
    x: params?.x ?? defaults.x,
    y: params?.y ?? defaults.y,
    scale: params?.scale ?? defaults.scale,
  };
}

export const PRESETS: readonly PresetSpec[] = [
  // Enter
  {
    phase: "enter",
    name: "fade",
    description: "Fade in.",
    affects: ["opacity"],
    defaults: ENTER_DEFAULTS,
    params: {},
    resolve: () => ({ fromDelta: { opacity: -1 }, toDelta: {} }),
  },
  {
    phase: "enter",
    name: "fade-up",
    description: "Fade in while moving up.",
    affects: ["opacity", "transform"],
    defaults: ENTER_DEFAULTS,
    params: { y: pxParam(12, "Initial Y offset (positive starts below, moves up).") },
    resolve: (p) => ({ fromDelta: { opacity: -1, y: p.y }, toDelta: {} }),
  },
  {
    phase: "enter",
    name: "fade-down",
    description: "Fade in while moving down.",
    affects: ["opacity", "transform"],
    defaults: ENTER_DEFAULTS,
    params: { y: pxParam(12, "Initial Y offset (positive starts above, moves down).") },
    resolve: (p) => ({ fromDelta: { opacity: -1, y: -p.y }, toDelta: {} }),
  },
  {
    phase: "enter",
    name: "fade-left",
    description: "Fade in while moving left.",
    affects: ["opacity", "transform"],
    defaults: ENTER_DEFAULTS,
    params: { x: pxParam(12, "Initial X offset (positive starts right, moves left).") },
    resolve: (p) => ({ fromDelta: { opacity: -1, x: p.x }, toDelta: {} }),
  },
  {
    phase: "enter",
    name: "fade-right",
    description: "Fade in while moving right.",
    affects: ["opacity", "transform"],
    defaults: ENTER_DEFAULTS,
    params: { x: pxParam(12, "Initial X offset (positive starts left, moves right).") },
    resolve: (p) => ({ fromDelta: { opacity: -1, x: -p.x }, toDelta: {} }),
  },
  {
    phase: "enter",
    name: "pop",
    description: "Fade and scale in (subtle pop).",
    affects: ["opacity", "transform"],
    defaults: ENTER_DEFAULTS,
    params: { scale: scaleParam(0.96, "Initial scale.") },
    resolve: (p) => ({ fromDelta: { opacity: -1, scale: p.scale - 1 }, toDelta: {} }),
  },
  {
    phase: "enter",
    name: "scale",
    description: "Scale in.",
    affects: ["transform"],
    defaults: ENTER_DEFAULTS,
    params: { scale: scaleParam(0.96, "Initial scale.") },
    resolve: (p) => ({ fromDelta: { scale: p.scale - 1 }, toDelta: {} }),
  },
  // Exit
  {
    phase: "exit",
    name: "fade",
    description: "Fade out.",
    affects: ["opacity"],
    defaults: EXIT_DEFAULTS,
    params: {},
    resolve: () => ({ fromDelta: {}, toDelta: { opacity: -1 } }),
  },
  {
    phase: "exit",
    name: "fade-up",
    description: "Fade out while moving up.",
    affects: ["opacity", "transform"],
    defaults: EXIT_DEFAULTS,
    params: { y: pxParam(12, "Final Y offset (positive moves up).") },
    resolve: (p) => ({ fromDelta: {}, toDelta: { opacity: -1, y: -p.y } }),
  },
  {
    phase: "exit",
    name: "fade-down",
    description: "Fade out while moving down.",
    affects: ["opacity", "transform"],
    defaults: EXIT_DEFAULTS,
    params: { y: pxParam(12, "Final Y offset (positive moves down).") },
    resolve: (p) => ({ fromDelta: {}, toDelta: { opacity: -1, y: p.y } }),
  },
  // Hover
  {
    phase: "hover",
    name: "lift",
    description: "Lift slightly on hover.",
    affects: ["transform"],
    defaults: HOVER_DEFAULTS,
    params: { y: pxParam(4, "Lift distance (positive lifts up).") },
    resolve: (p) => ({ fromDelta: {}, toDelta: { y: -p.y } }),
  },
  {
    phase: "hover",
    name: "grow",
    description: "Scale up slightly on hover.",
    affects: ["transform"],
    defaults: HOVER_DEFAULTS,
    params: { scale: scaleParam(1.02, "Hover scale.") },
    resolve: (p) => ({ fromDelta: {}, toDelta: { scale: p.scale - 1 } }),
  },
  // Press
  {
    phase: "press",
    name: "compress",
    description: "Scale down slightly on press.",
    affects: ["transform"],
    defaults: PRESS_DEFAULTS,
    params: { scale: scaleParam(0.98, "Press scale.") },
    resolve: (p) => ({ fromDelta: {}, toDelta: { scale: p.scale - 1 } }),
  },
  // Focus
  {
    phase: "focus",
    name: "lift",
    description: "Lift slightly on focus.",
    affects: ["transform"],
    defaults: FOCUS_DEFAULTS,
    params: { y: pxParam(2, "Lift distance (positive lifts up).") },
    resolve: (p) => ({ fromDelta: {}, toDelta: { y: -p.y } }),
  },
] as const;

export function getPresetManifestItems(): PresetManifestItem[] {
  return PRESETS.map((p) => ({
    phase: p.phase,
    name: p.name,
    description: p.description,
    tokens: [`${p.phase}:${p.name}`],
    params: p.params,
    defaults: p.defaults,
    affects: p.affects,
  }));
}

export function resolvePreset(
  phase: PresetPhase,
  name: string,
  params: PresetParams | undefined
): Readonly<{
  fromDelta?: PartialMotionState;
  toDelta?: PartialMotionState;
  defaults: { durationMs: number; delayMs: number; easing: EasingName };
  affects: PresetManifestItem["affects"];
  paramsMeta: PresetManifestItem["params"];
}> | null {
  const spec = PRESETS.find((p) => p.phase === phase && p.name === name);
  if (!spec) return null;

  const defaults = {
    x: spec.params.x?.default ?? 0,
    y: spec.params.y?.default ?? 0,
    scale: spec.params.scale?.default ?? 1,
  };

  const p = withDefaults(params, defaults);
  const { fromDelta, toDelta } = spec.resolve(p);
  const result: {
    fromDelta?: PartialMotionState;
    toDelta?: PartialMotionState;
    defaults: { durationMs: number; delayMs: number; easing: EasingName };
    affects: PresetManifestItem["affects"];
    paramsMeta: PresetManifestItem["params"];
  } = {
    defaults: spec.defaults,
    affects: spec.affects,
    paramsMeta: spec.params,
  };

  if (fromDelta !== undefined) result.fromDelta = fromDelta;
  if (toDelta !== undefined) result.toDelta = toDelta;
  return result;
}

export function isKnownPreset(phase: PresetPhase, name: string): boolean {
  return PRESETS.some((p) => p.phase === phase && p.name === name);
}
