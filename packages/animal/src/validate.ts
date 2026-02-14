import { parseAnimalTokens } from "./tokens";
import type { PresetPhase } from "./types";

export type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
  parsed: ReturnType<typeof parseAnimalTokens>;
};

export function validate(an: string): ValidationResult {
  const parsed = parseAnimalTokens(an);
  const errors: string[] = [];
  const warnings: string[] = [];

  // Unknown tokens are errors
  if (parsed.unknownTokens?.length) {
    for (const t of parsed.unknownTokens) {
      errors.push(`Unknown token: "${t}"`);
    }
  }

  // Warn if no presets specified
  const phases: PresetPhase[] = ["enter", "exit", "hover", "press", "focus"];
  const hasPreset = phases.some((p) => parsed[p]?.preset);
  if (!hasPreset) {
    warnings.push("No presets specified. The an string has no visual effect.");
  }

  // Warn about exit without enter
  if (parsed.exit?.preset && !parsed.enter?.preset) {
    warnings.push("Exit preset without enter preset. Element will exit but has no enter animation.");
  }

  // Warn about loop on exit phase
  if (parsed.exit?.options?.loop !== undefined) {
    warnings.push("Loop on exit phase has no effect (exit must complete for unmount).");
  }

  // Warn about scroll-progress + in-view conflict
  if (parsed.scrollProgress && parsed.inView) {
    warnings.push("scroll-progress and in-view are mutually exclusive. scroll-progress takes precedence.");
  }

  return { valid: errors.length === 0, errors, warnings, parsed };
}
