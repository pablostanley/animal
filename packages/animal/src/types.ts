export type PresetPhase = "enter" | "exit" | "hover" | "press" | "focus";

export type SpringPresetName = "default" | "snappy" | "bouncy" | "strong";

export type EasingName =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | `spring-${SpringPresetName}`;

export type MotionState = Readonly<{
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
}>;

export type MotionStateKey = keyof MotionState;

export type PartialMotionState = Partial<MotionState>;

export type PresetParams = {
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
};

export type AnimalOptions = {
  duration?: number;
  delay?: number;
  easing?: EasingName;
  reducedMotion?: "system" | "always" | "never";
};

export type PhaseConfig = {
  preset?: string;
  params?: PresetParams;
  options?: AnimalOptions;
};

export type AnimalConfig = {
  enter?: PhaseConfig;
  exit?: PhaseConfig;
  hover?: PhaseConfig;
  press?: PhaseConfig;
  focus?: PhaseConfig;
  options?: AnimalOptions;
  unknownTokens?: string[];
};

export type PresetManifestItem = {
  phase: PresetPhase;
  name: string;
  description: string;
  tokens: string[];
  params: {
    x?: { default: number; unit: "px"; description: string };
    y?: { default: number; unit: "px"; description: string };
    scale?: { default: number; unit: "ratio"; description: string };
    rotate?: { default: number; unit: "deg"; description: string };
  };
  defaults: {
    durationMs: number;
    delayMs: number;
    easing: EasingName;
  };
  affects: Array<"transform" | "opacity">;
};

export type AnimalManifest = {
  schemaVersion: 1;
  name: string;
  reactEntry: string;
  tokens: Array<{
    token: string;
    description: string;
    examples: string[];
  }>;
  presets: PresetManifestItem[];
};

export const DEFAULT_STATE: MotionState = Object.freeze({
  x: 0,
  y: 0,
  scale: 1,
  rotate: 0,
  opacity: 1,
});

