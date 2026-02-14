import type { AnimalManifest } from "./types";
import { getPresetManifestItems } from "./presets";

export const ANIMAL_MANIFEST: AnimalManifest = Object.freeze({
  schemaVersion: 1,
  // Product name can change without breaking the package name.
  name: "Animal",
  reactEntry: "@vercel/animal/react",
  tokens: [
    {
      token: "<phase>:<preset>",
      description: "Apply a preset to a phase. Unprefixed presets default to enter.",
      examples: ["enter:fade-up", "hover:lift", "press:compress", "fade-up"],
    },
    {
      token: "duration-<ms>",
      description: "Set duration in milliseconds (global or phase-scoped).",
      examples: ["duration-240", "enter:duration-360"],
    },
    {
      token: "delay-<ms>",
      description: "Set delay in milliseconds (global or phase-scoped).",
      examples: ["delay-60", "hover:delay-0"],
    },
    {
      token: "ease",
      description: "Shorthand for CSS `ease` (global or phase-scoped).",
      examples: ["ease", "enter:ease"],
    },
    {
      token: "ease-<name>",
      description:
        "Set easing (global or phase-scoped). Names: linear, ease, in, out, in-out, spring-default, spring-snappy, spring-bouncy, spring-strong.",
      examples: ["ease-out", "enter:ease-spring-snappy"],
    },
    {
      token: "x-<px> | y-<px> | scale-<ratio>",
      description: "Preset parameters (defaults to enter unless phase-scoped).",
      examples: ["enter:y-16", "hover:y-6", "pop scale-0.94"],
    },
    {
      token: "rm-system | rm-always | rm-never",
      description: "Reduced motion policy (defaults to system).",
      examples: ["rm-system", "rm-always"],
    },
    {
      token: "in-view | in-view-repeat",
      description: "Delay enter animation until element scrolls into viewport. in-view triggers once, in-view-repeat re-triggers on every intersection.",
      examples: ["in-view", "in-view-repeat"],
    },
    {
      token: "ease-cubic-<a>-<b>-<c>-<d>",
      description: "Custom cubic-bezier easing curve.",
      examples: ["ease-cubic-0.4-0-0.2-1", "ease-cubic-0.25-0.1-0.25-1"],
    },
  ],
  presets: getPresetManifestItems(),
});
