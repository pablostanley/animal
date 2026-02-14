export { ANIMAL_MANIFEST } from "./manifest";
export { ANIMAL_MANIFEST_SCHEMA } from "./manifest-schema";
export { parseAnimalTokens } from "./tokens";
export { validate } from "./validate";
export { isKnownPreset, resolvePreset } from "./presets";
export { CSS_EASINGS, SPRING_PRESETS, getSpringPresetName, isSpringEasing } from "./easings";
export { simulateSpring } from "./spring";

export type {
  AnimalConfig,
  AnimalManifest,
  AnimalOptions,
  EasingName,
  MotionState,
  PartialMotionState,
  PhaseConfig,
  PresetManifestItem,
  PresetParams,
  PresetPhase,
  SpringPresetName,
} from "./types";

export type { ValidationResult } from "./validate";

export { DEFAULT_STATE } from "./types";

