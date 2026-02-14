import { describe, expect, it } from "vitest";
import { getPresetManifestItems, isKnownPreset, resolvePreset } from "../presets";

describe("presets", () => {
  it("exposes a stable manifest list", () => {
    const items = getPresetManifestItems();
    expect(items.length).toBeGreaterThan(0);
    expect(items.some((p) => p.tokens.includes("enter:fade-up"))).toBe(true);
    expect(items.some((p) => p.tokens.includes("enter:slide-right"))).toBe(true);
  });

  it("resolves a preset with parameters", () => {
    const preset = resolvePreset("enter", "fade-up", { y: 20 });
    expect(preset).not.toBeNull();
    expect(preset?.fromDelta?.opacity).toBe(-1);
    expect(preset?.fromDelta?.y).toBe(20);
  });

  it("reports known presets accurately", () => {
    expect(isKnownPreset("enter", "fade-up")).toBe(true);
    expect(isKnownPreset("enter", "nope")).toBe(false);
  });
});
