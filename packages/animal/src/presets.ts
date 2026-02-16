import type {
  EasingName,
  KeyframeStep,
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
  resolve: (params: Required<PresetParams>) =>
    | Readonly<{ fromDelta?: PartialMotionState; toDelta?: PartialMotionState }>
    | Readonly<{ keyframes: readonly KeyframeStep[] }>;
}>;

const pxParam = (def: number, description: string) => ({ default: def, unit: "px" as const, description });
const scaleParam = (def: number, description: string) => ({
  default: def,
  unit: "ratio" as const,
  description,
});
const degParam = (def: number, description: string) => ({ default: def, unit: "deg" as const, description });

const ENTER_DEFAULTS: PresetManifestItem["defaults"] = {
  durationMs: 360,
  delayMs: 0,
  easing: "spring-default",
};

const EXIT_DEFAULTS: PresetManifestItem["defaults"] = {
  durationMs: 240,
  delayMs: 0,
  easing: "ease-in",
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
    rotate: params?.rotate ?? defaults.rotate,
  };
}

// --- Intensity variant helpers ---

type IntensitySuffix = "sm" | "lg" | "xl" | "2xl";
const INTENSITY_SUFFIXES: IntensitySuffix[] = ["sm", "lg", "xl", "2xl"];

// Duration scales proportionally with intensity so larger animations don't feel rushed
const DURATION_SCALE: Record<IntensitySuffix, number> = { sm: 1, lg: 1.25, xl: 1.5, "2xl": 1.75 };

function positionVariants(base: PresetSpec, paramKey: "x" | "y", sizes: Record<IntensitySuffix, number>): PresetSpec[] {
  return INTENSITY_SUFFIXES.map((suffix) => ({
    ...base,
    name: `${base.name}-${suffix}`,
    description: `${base.description.replace(/\.$/, "")} (${suffix}).`,
    defaults: {
      ...base.defaults,
      durationMs: Math.round(base.defaults.durationMs * DURATION_SCALE[suffix]),
    },
    params: { [paramKey]: pxParam(sizes[suffix], base.params[paramKey]!.description) },
  }));
}

function scaleVariants(base: PresetSpec, sizes: Record<IntensitySuffix, number>): PresetSpec[] {
  return INTENSITY_SUFFIXES.map((suffix) => ({
    ...base,
    name: `${base.name}-${suffix}`,
    description: `${base.description.replace(/\.$/, "")} (${suffix}).`,
    defaults: {
      ...base.defaults,
      durationMs: Math.round(base.defaults.durationMs * DURATION_SCALE[suffix]),
    },
    params: { scale: scaleParam(sizes[suffix], base.params.scale!.description) },
  }));
}

const POS_SIZES: Record<IntensitySuffix, number> = { sm: 8, lg: 48, xl: 80, "2xl": 120 };
const ENTER_SCALE_SIZES: Record<IntensitySuffix, number> = { sm: 0.95, lg: 0.7, xl: 0.5, "2xl": 0.3 };
const EXIT_SCALE_SIZES: Record<IntensitySuffix, number> = { sm: 0.95, lg: 0.7, xl: 0.5, "2xl": 0.3 };
const ZOOM_OUT_SIZES: Record<IntensitySuffix, number> = { sm: 1.05, lg: 1.3, xl: 1.5, "2xl": 1.75 };
const BOUNCE_IN_SIZES: Record<IntensitySuffix, number> = { sm: 12, lg: 48, xl: 80, "2xl": 120 };
const DROP_IN_SIZES: Record<IntensitySuffix, number> = { sm: 16, lg: 60, xl: 100, "2xl": 140 };
const ELASTIC_SCALE_SIZES: Record<IntensitySuffix, number> = { sm: 0.92, lg: 0.7, xl: 0.5, "2xl": 0.3 };
const ZOOM_IN_SIZES: Record<IntensitySuffix, number> = { sm: 1.05, lg: 1.3, xl: 1.5, "2xl": 1.75 };
const BOUNCE_OUT_SIZES: Record<IntensitySuffix, number> = { sm: 12, lg: 48, xl: 80, "2xl": 120 };
const DROP_OUT_SIZES: Record<IntensitySuffix, number> = { sm: 16, lg: 60, xl: 100, "2xl": 140 };
const EXIT_ELASTIC_SIZES: Record<IntensitySuffix, number> = { sm: 0.92, lg: 0.7, xl: 0.5, "2xl": 0.3 };

// --- Base presets ---

const enterSlideLeft: PresetSpec = {
  phase: "enter",
  name: "slide-left",
  description: "Slide in from the right.",
  affects: ["transform"],
  defaults: ENTER_DEFAULTS,
  params: { x: pxParam(24, "Initial X offset (positive starts right, moves left).") },
  resolve: (p) => ({ fromDelta: { x: p.x }, toDelta: {} }),
};

const enterSlideRight: PresetSpec = {
  phase: "enter",
  name: "slide-right",
  description: "Slide in from the left.",
  affects: ["transform"],
  defaults: ENTER_DEFAULTS,
  params: { x: pxParam(24, "Initial X offset (positive starts left, moves right).") },
  resolve: (p) => ({ fromDelta: { x: -p.x }, toDelta: {} }),
};

const enterSlideUp: PresetSpec = {
  phase: "enter",
  name: "slide-up",
  description: "Slide in from below.",
  affects: ["transform"],
  defaults: ENTER_DEFAULTS,
  params: { y: pxParam(24, "Initial Y offset (positive starts below, moves up).") },
  resolve: (p) => ({ fromDelta: { y: p.y }, toDelta: {} }),
};

const enterSlideDown: PresetSpec = {
  phase: "enter",
  name: "slide-down",
  description: "Slide in from above.",
  affects: ["transform"],
  defaults: ENTER_DEFAULTS,
  params: { y: pxParam(24, "Initial Y offset (positive starts above, moves down).") },
  resolve: (p) => ({ fromDelta: { y: -p.y }, toDelta: {} }),
};

const enterFadeUp: PresetSpec = {
  phase: "enter",
  name: "fade-up",
  description: "Fade in while moving up.",
  affects: ["opacity", "transform"],
  defaults: ENTER_DEFAULTS,
  params: { y: pxParam(24, "Initial Y offset (positive starts below, moves up).") },
  resolve: (p) => ({ fromDelta: { opacity: -1, y: p.y }, toDelta: {} }),
};

const enterFadeDown: PresetSpec = {
  phase: "enter",
  name: "fade-down",
  description: "Fade in while moving down.",
  affects: ["opacity", "transform"],
  defaults: ENTER_DEFAULTS,
  params: { y: pxParam(24, "Initial Y offset (positive starts above, moves down).") },
  resolve: (p) => ({ fromDelta: { opacity: -1, y: -p.y }, toDelta: {} }),
};

const enterFadeLeft: PresetSpec = {
  phase: "enter",
  name: "fade-left",
  description: "Fade in while moving left.",
  affects: ["opacity", "transform"],
  defaults: ENTER_DEFAULTS,
  params: { x: pxParam(24, "Initial X offset (positive starts right, moves left).") },
  resolve: (p) => ({ fromDelta: { opacity: -1, x: p.x }, toDelta: {} }),
};

const enterFadeRight: PresetSpec = {
  phase: "enter",
  name: "fade-right",
  description: "Fade in while moving right.",
  affects: ["opacity", "transform"],
  defaults: ENTER_DEFAULTS,
  params: { x: pxParam(24, "Initial X offset (positive starts left, moves right).") },
  resolve: (p) => ({ fromDelta: { opacity: -1, x: -p.x }, toDelta: {} }),
};

const enterPop: PresetSpec = {
  phase: "enter",
  name: "pop",
  description: "Fade and scale in (subtle pop).",
  affects: ["opacity", "transform"],
  defaults: ENTER_DEFAULTS,
  params: { scale: scaleParam(0.85, "Initial scale.") },
  resolve: (p) => ({ fromDelta: { opacity: -1, scale: p.scale - 1 }, toDelta: {} }),
};

const enterScale: PresetSpec = {
  phase: "enter",
  name: "scale",
  description: "Scale in.",
  affects: ["transform"],
  defaults: ENTER_DEFAULTS,
  params: { scale: scaleParam(0.85, "Initial scale.") },
  resolve: (p) => ({ fromDelta: { scale: p.scale - 1 }, toDelta: {} }),
};

const enterBounceIn: PresetSpec = {
  phase: "enter",
  name: "bounce-in",
  description: "Bounce in with elastic overshoot.",
  affects: ["opacity", "transform"],
  defaults: { durationMs: 600, delayMs: 0, easing: "linear" },
  params: { y: pxParam(24, "Initial Y offset.") },
  resolve: (p) => ({
    keyframes: [
      { offset: 0, state: { opacity: -1, y: p.y } },
      { offset: 0.5, state: { opacity: 0, y: -6 } },
      { offset: 0.75, state: { y: 3 } },
      { offset: 1, state: {} },
    ],
  }),
};

const enterElasticScale: PresetSpec = {
  phase: "enter",
  name: "elastic-scale",
  description: "Scale in with elastic bounce.",
  affects: ["opacity", "transform"],
  defaults: { durationMs: 600, delayMs: 0, easing: "linear" },
  params: { scale: scaleParam(0.85, "Initial scale.") },
  resolve: (p) => ({
    keyframes: [
      { offset: 0, state: { opacity: -1, scale: p.scale - 1 } },
      { offset: 0.55, state: { opacity: 0, scale: 0.06 } },
      { offset: 0.75, state: { scale: -0.03 } },
      { offset: 1, state: {} },
    ],
  }),
};

const enterDropIn: PresetSpec = {
  phase: "enter",
  name: "drop-in",
  description: "Drop in from above with bounce.",
  affects: ["opacity", "transform"],
  defaults: { durationMs: 600, delayMs: 0, easing: "linear" },
  params: { y: pxParam(30, "Drop distance.") },
  resolve: (p) => ({
    keyframes: [
      { offset: 0, state: { opacity: -1, y: -p.y } },
      { offset: 0.5, state: { opacity: 0, y: 4 } },
      { offset: 0.75, state: { y: -2 } },
      { offset: 1, state: {} },
    ],
  }),
};

const enterZoomIn: PresetSpec = {
  phase: "enter",
  name: "zoom-in",
  description: "Scale down from large and fade in.",
  affects: ["opacity", "transform"],
  defaults: ENTER_DEFAULTS,
  params: { scale: scaleParam(1.15, "Initial scale.") },
  resolve: (p) => ({ fromDelta: { opacity: -1, scale: p.scale - 1 }, toDelta: {} }),
};

const exitSlideLeft: PresetSpec = {
  phase: "exit",
  name: "slide-left",
  description: "Slide out to the left.",
  affects: ["transform"],
  defaults: EXIT_DEFAULTS,
  params: { x: pxParam(24, "Final X offset (positive moves left).") },
  resolve: (p) => ({ fromDelta: {}, toDelta: { x: -p.x } }),
};

const exitSlideRight: PresetSpec = {
  phase: "exit",
  name: "slide-right",
  description: "Slide out to the right.",
  affects: ["transform"],
  defaults: EXIT_DEFAULTS,
  params: { x: pxParam(24, "Final X offset (positive moves right).") },
  resolve: (p) => ({ fromDelta: {}, toDelta: { x: p.x } }),
};

const exitSlideUp: PresetSpec = {
  phase: "exit",
  name: "slide-up",
  description: "Slide out up.",
  affects: ["transform"],
  defaults: EXIT_DEFAULTS,
  params: { y: pxParam(24, "Final Y offset (positive moves up).") },
  resolve: (p) => ({ fromDelta: {}, toDelta: { y: -p.y } }),
};

const exitSlideDown: PresetSpec = {
  phase: "exit",
  name: "slide-down",
  description: "Slide out down.",
  affects: ["transform"],
  defaults: EXIT_DEFAULTS,
  params: { y: pxParam(24, "Final Y offset (positive moves down).") },
  resolve: (p) => ({ fromDelta: {}, toDelta: { y: p.y } }),
};

const exitFadeUp: PresetSpec = {
  phase: "exit",
  name: "fade-up",
  description: "Fade out while moving up.",
  affects: ["opacity", "transform"],
  defaults: EXIT_DEFAULTS,
  params: { y: pxParam(24, "Final Y offset (positive moves up).") },
  resolve: (p) => ({ fromDelta: {}, toDelta: { opacity: -1, y: -p.y } }),
};

const exitFadeDown: PresetSpec = {
  phase: "exit",
  name: "fade-down",
  description: "Fade out while moving down.",
  affects: ["opacity", "transform"],
  defaults: EXIT_DEFAULTS,
  params: { y: pxParam(24, "Final Y offset (positive moves down).") },
  resolve: (p) => ({ fromDelta: {}, toDelta: { opacity: -1, y: p.y } }),
};

const exitFadeLeft: PresetSpec = {
  phase: "exit",
  name: "fade-left",
  description: "Fade out while moving left.",
  affects: ["opacity", "transform"],
  defaults: EXIT_DEFAULTS,
  params: { x: pxParam(24, "Final X offset (positive moves left).") },
  resolve: (p) => ({ toDelta: { opacity: -1, x: -p.x } }),
};

const exitFadeRight: PresetSpec = {
  phase: "exit",
  name: "fade-right",
  description: "Fade out while moving right.",
  affects: ["opacity", "transform"],
  defaults: EXIT_DEFAULTS,
  params: { x: pxParam(24, "Final X offset (positive moves right).") },
  resolve: (p) => ({ toDelta: { opacity: -1, x: p.x } }),
};

const exitPop: PresetSpec = {
  phase: "exit",
  name: "pop",
  description: "Fade and scale out (shrink).",
  affects: ["opacity", "transform"],
  defaults: EXIT_DEFAULTS,
  params: { scale: scaleParam(0.85, "Final scale.") },
  resolve: (p) => ({ toDelta: { opacity: -1, scale: p.scale - 1 } }),
};

const exitScale: PresetSpec = {
  phase: "exit",
  name: "scale",
  description: "Scale out.",
  affects: ["transform"],
  defaults: EXIT_DEFAULTS,
  params: { scale: scaleParam(0.85, "Final scale.") },
  resolve: (p) => ({ toDelta: { scale: p.scale - 1 } }),
};

const exitZoomOut: PresetSpec = {
  phase: "exit",
  name: "zoom-out",
  description: "Scale up and fade out.",
  affects: ["opacity", "transform"],
  defaults: EXIT_DEFAULTS,
  params: { scale: scaleParam(1.15, "Final scale.") },
  resolve: (p) => ({
    keyframes: [
      { offset: 0, state: {} },
      { offset: 1, state: { opacity: -1, scale: p.scale - 1 } },
    ],
  }),
};

const exitBounceOut: PresetSpec = {
  phase: "exit",
  name: "bounce-out",
  description: "Bounce out downward with elastic overshoot.",
  affects: ["opacity", "transform"],
  defaults: { durationMs: 600, delayMs: 0, easing: "linear" },
  params: { y: pxParam(24, "Final Y offset.") },
  resolve: (p) => ({
    keyframes: [
      { offset: 0, state: {} },
      { offset: 0.25, state: { y: -4 } },
      { offset: 0.5, state: { y: 6 } },
      { offset: 1, state: { opacity: -1, y: p.y } },
    ],
  }),
};

const exitDropOut: PresetSpec = {
  phase: "exit",
  name: "drop-out",
  description: "Drop out downward with bounce.",
  affects: ["opacity", "transform"],
  defaults: { durationMs: 600, delayMs: 0, easing: "linear" },
  params: { y: pxParam(30, "Drop distance.") },
  resolve: (p) => ({
    keyframes: [
      { offset: 0, state: {} },
      { offset: 0.25, state: { y: -3 } },
      { offset: 0.5, state: { y: 2 } },
      { offset: 1, state: { opacity: -1, y: p.y } },
    ],
  }),
};

const exitElasticScale: PresetSpec = {
  phase: "exit",
  name: "elastic-scale",
  description: "Scale out with elastic bounce.",
  affects: ["opacity", "transform"],
  defaults: { durationMs: 600, delayMs: 0, easing: "linear" },
  params: { scale: scaleParam(0.85, "Final scale.") },
  resolve: (p) => ({
    keyframes: [
      { offset: 0, state: {} },
      { offset: 0.25, state: { scale: 0.04 } },
      { offset: 0.45, state: { scale: -0.03 } },
      { offset: 1, state: { opacity: -1, scale: p.scale - 1 } },
    ],
  }),
};

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
  enterSlideLeft,
  ...positionVariants(enterSlideLeft, "x", POS_SIZES),
  enterSlideRight,
  ...positionVariants(enterSlideRight, "x", POS_SIZES),
  enterSlideUp,
  ...positionVariants(enterSlideUp, "y", POS_SIZES),
  enterSlideDown,
  ...positionVariants(enterSlideDown, "y", POS_SIZES),
  enterFadeUp,
  ...positionVariants(enterFadeUp, "y", POS_SIZES),
  enterFadeDown,
  ...positionVariants(enterFadeDown, "y", POS_SIZES),
  enterFadeLeft,
  ...positionVariants(enterFadeLeft, "x", POS_SIZES),
  enterFadeRight,
  ...positionVariants(enterFadeRight, "x", POS_SIZES),
  enterPop,
  ...scaleVariants(enterPop, ENTER_SCALE_SIZES),
  enterScale,
  ...scaleVariants(enterScale, ENTER_SCALE_SIZES),
  enterBounceIn,
  ...positionVariants(enterBounceIn, "y", BOUNCE_IN_SIZES),
  enterElasticScale,
  ...scaleVariants(enterElasticScale, ELASTIC_SCALE_SIZES),
  enterDropIn,
  ...positionVariants(enterDropIn, "y", DROP_IN_SIZES),
  enterZoomIn,
  ...scaleVariants(enterZoomIn, ZOOM_IN_SIZES),
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
  exitSlideLeft,
  ...positionVariants(exitSlideLeft, "x", POS_SIZES),
  exitSlideRight,
  ...positionVariants(exitSlideRight, "x", POS_SIZES),
  exitSlideUp,
  ...positionVariants(exitSlideUp, "y", POS_SIZES),
  exitSlideDown,
  ...positionVariants(exitSlideDown, "y", POS_SIZES),
  exitFadeUp,
  ...positionVariants(exitFadeUp, "y", POS_SIZES),
  exitFadeDown,
  ...positionVariants(exitFadeDown, "y", POS_SIZES),
  exitFadeLeft,
  ...positionVariants(exitFadeLeft, "x", POS_SIZES),
  exitFadeRight,
  ...positionVariants(exitFadeRight, "x", POS_SIZES),
  exitPop,
  ...scaleVariants(exitPop, EXIT_SCALE_SIZES),
  exitScale,
  ...scaleVariants(exitScale, EXIT_SCALE_SIZES),
  exitZoomOut,
  ...scaleVariants(exitZoomOut, ZOOM_OUT_SIZES),
  exitBounceOut,
  ...positionVariants(exitBounceOut, "y", BOUNCE_OUT_SIZES),
  exitDropOut,
  ...positionVariants(exitDropOut, "y", DROP_OUT_SIZES),
  exitElasticScale,
  ...scaleVariants(exitElasticScale, EXIT_ELASTIC_SIZES),
  // Hover
  {
    phase: "hover",
    name: "lift",
    description: "Lift slightly on hover.",
    affects: ["transform"],
    defaults: HOVER_DEFAULTS,
    params: { y: pxParam(6, "Lift distance (positive lifts up).") },
    resolve: (p) => ({ fromDelta: {}, toDelta: { y: -p.y } }),
  },
  {
    phase: "hover",
    name: "grow",
    description: "Scale up slightly on hover.",
    affects: ["transform"],
    defaults: HOVER_DEFAULTS,
    params: { scale: scaleParam(1.05, "Hover scale.") },
    resolve: (p) => ({ fromDelta: {}, toDelta: { scale: p.scale - 1 } }),
  },
  {
    phase: "hover",
    name: "shrink",
    description: "Scale down slightly on hover.",
    affects: ["transform"],
    defaults: HOVER_DEFAULTS,
    params: { scale: scaleParam(0.95, "Hover scale.") },
    resolve: (p) => ({ toDelta: { scale: p.scale - 1 } }),
  },
  {
    phase: "hover",
    name: "tilt",
    description: "Tilt slightly on hover.",
    affects: ["transform"],
    defaults: HOVER_DEFAULTS,
    params: { rotate: degParam(3, "Tilt angle in degrees.") },
    resolve: (p) => ({ fromDelta: {}, toDelta: { rotate: p.rotate } }),
  },
  // Press
  {
    phase: "press",
    name: "compress",
    description: "Scale down slightly on press.",
    affects: ["transform"],
    defaults: PRESS_DEFAULTS,
    params: { scale: scaleParam(0.95, "Press scale.") },
    resolve: (p) => ({ fromDelta: {}, toDelta: { scale: p.scale - 1 } }),
  },
  {
    phase: "press",
    name: "push",
    description: "Push down slightly on press.",
    affects: ["transform"],
    defaults: PRESS_DEFAULTS,
    params: { y: pxParam(3, "Push distance (positive pushes down).") },
    resolve: (p) => ({ toDelta: { y: p.y } }),
  },
  {
    phase: "press",
    name: "squish",
    description: "Squish vertically on press.",
    affects: ["transform"],
    defaults: PRESS_DEFAULTS,
    params: { scale: scaleParam(0.92, "Vertical squish scale.") },
    resolve: (p) => ({ fromDelta: {}, toDelta: { scale: p.scale - 1 } }),
  },
  // Focus
  {
    phase: "focus",
    name: "lift",
    description: "Lift slightly on focus.",
    affects: ["transform"],
    defaults: FOCUS_DEFAULTS,
    params: { y: pxParam(3, "Lift distance (positive lifts up).") },
    resolve: (p) => ({ fromDelta: {}, toDelta: { y: -p.y } }),
  },
  {
    phase: "focus",
    name: "grow",
    description: "Scale up slightly on focus.",
    affects: ["transform"],
    defaults: FOCUS_DEFAULTS,
    params: { scale: scaleParam(1.05, "Focus scale.") },
    resolve: (p) => ({ fromDelta: {}, toDelta: { scale: p.scale - 1 } }),
  },
] as const;

function generateCodeExample(phase: string, name: string): string {
  if (phase === "enter" || phase === "exit") {
    return `<Presence present={open}>\n  <A.div an="${phase}:${name}">\n    Content\n  </A.div>\n</Presence>`;
  }
  return `<A.button an="${phase}:${name}">Click me</A.button>`;
}

export function getPresetManifestItems(): PresetManifestItem[] {
  return PRESETS.map((p) => ({
    phase: p.phase,
    name: p.name,
    description: p.description,
    tokens: [`${p.phase}:${p.name}`],
    params: p.params,
    defaults: p.defaults,
    affects: p.affects,
    codeExample: generateCodeExample(p.phase, p.name),
  }));
}

export function resolvePreset(
  phase: PresetPhase,
  name: string,
  params: PresetParams | undefined
): Readonly<{
  fromDelta?: PartialMotionState;
  toDelta?: PartialMotionState;
  keyframes?: readonly KeyframeStep[];
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
    rotate: spec.params.rotate?.default ?? 0,
  };

  const p = withDefaults(params, defaults);
  const resolved = spec.resolve(p);

  if ("keyframes" in resolved) {
    return {
      keyframes: resolved.keyframes,
      defaults: spec.defaults,
      affects: spec.affects,
      paramsMeta: spec.params,
    };
  }

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

  if (resolved.fromDelta !== undefined) result.fromDelta = resolved.fromDelta;
  if (resolved.toDelta !== undefined) result.toDelta = resolved.toDelta;
  return result;
}

export function isKnownPreset(phase: PresetPhase, name: string): boolean {
  return PRESETS.some((p) => p.phase === phase && p.name === name);
}
