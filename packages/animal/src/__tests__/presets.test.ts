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

  it("resolves exit:fade-left preset", () => {
    const preset = resolvePreset("exit", "fade-left", {});
    expect(preset).not.toBeNull();
    expect(preset?.toDelta?.opacity).toBe(-1);
    expect(preset?.toDelta?.x).toBe(-12);
  });

  it("resolves exit:pop preset", () => {
    const preset = resolvePreset("exit", "pop", {});
    expect(preset).not.toBeNull();
    expect(preset?.toDelta?.opacity).toBe(-1);
    expect(preset?.toDelta?.scale).toBe(0.96 - 1);
  });

  it("resolves hover:shrink preset", () => {
    const preset = resolvePreset("hover", "shrink", {});
    expect(preset).not.toBeNull();
    expect(preset?.toDelta?.scale).toBe(0.98 - 1);
  });

  it("resolves press:push preset", () => {
    const preset = resolvePreset("press", "push", {});
    expect(preset).not.toBeNull();
    expect(preset?.toDelta?.y).toBe(2);
  });
});
