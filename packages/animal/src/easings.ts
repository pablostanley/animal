import type { EasingName, SpringPresetName } from "./types";

export type SpringParams = Readonly<{
  stiffness: number;
  damping: number;
  mass: number;
}>;

export const CSS_EASINGS: Readonly<Record<Exclude<EasingName, `spring-${SpringPresetName}`>, string>> =
  Object.freeze({
    linear: "linear",
    ease: "ease",
    "ease-in": "ease-in",
    "ease-out": "ease-out",
    "ease-in-out": "ease-in-out",
  });

export const SPRING_PRESETS: Readonly<Record<SpringPresetName, SpringParams>> = Object.freeze({
  // Roughly aligned to the feel of common UI spring defaults (snappy without being bouncy).
  default: { stiffness: 170, damping: 26, mass: 1 },
  snappy: { stiffness: 320, damping: 34, mass: 1 },
  bouncy: { stiffness: 170, damping: 14, mass: 1 },
  strong: { stiffness: 520, damping: 44, mass: 1 },
});

export function isSpringEasing(easing: string | undefined): easing is `spring-${SpringPresetName}` {
  if (typeof easing !== "string" || !easing.startsWith("spring-")) return false;
  const name = easing.slice("spring-".length);
  return name === "default" || name === "snappy" || name === "bouncy" || name === "strong";
}

export function getSpringPresetName(easing: `spring-${SpringPresetName}`): SpringPresetName {
  return easing.slice("spring-".length) as SpringPresetName;
}

