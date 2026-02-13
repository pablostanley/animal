export { ANIMAL_MANIFEST } from "./manifest";
export { parseAnimalTokens } from "./tokens";
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

export { DEFAULT_STATE } from "./types";

