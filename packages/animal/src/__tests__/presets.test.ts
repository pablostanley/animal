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
    expect(preset?.toDelta?.x).toBe(-24);
  });

  it("resolves exit:pop preset", () => {
    const preset = resolvePreset("exit", "pop", {});
    expect(preset).not.toBeNull();
    expect(preset?.toDelta?.opacity).toBe(-1);
    expect(preset?.toDelta?.scale).toBe(0.85 - 1);
  });

  it("resolves hover:shrink preset", () => {
    const preset = resolvePreset("hover", "shrink", {});
    expect(preset).not.toBeNull();
    expect(preset?.toDelta?.scale).toBe(0.95 - 1);
  });

  it("resolves press:push preset", () => {
    const preset = resolvePreset("press", "push", {});
    expect(preset).not.toBeNull();
    expect(preset?.toDelta?.y).toBe(3);
  });

  it("resolves enter:bounce-in as keyframe preset", () => {
    const result = resolvePreset("enter", "bounce-in", {});
    expect(result).not.toBeNull();
    expect(result?.keyframes).toBeDefined();
    expect(result!.keyframes!.length).toBe(4);
    expect(result!.keyframes![0]!.offset).toBe(0);
    expect(result!.keyframes![3]!.offset).toBe(1);
  });

  it("resolves enter:elastic-scale as keyframe preset", () => {
    const result = resolvePreset("enter", "elastic-scale", {});
    expect(result).not.toBeNull();
    expect(result?.keyframes).toBeDefined();
    expect(result!.keyframes!.length).toBe(4);
  });

  it("resolves exit:zoom-out as keyframe preset", () => {
    const result = resolvePreset("exit", "zoom-out", {});
    expect(result).not.toBeNull();
    expect(result?.keyframes).toBeDefined();
    expect(result!.keyframes![result!.keyframes!.length - 1]!.state.opacity).toBe(-1);
  });

  it("has 151 total presets in the manifest", () => {
    const items = getPresetManifestItems();
    expect(items.length).toBe(151);
  });

  // --- Intensity variant tests ---

  it("resolves enter:fade-up-sm with y=8", () => {
    const preset = resolvePreset("enter", "fade-up-sm", {});
    expect(preset).not.toBeNull();
    expect(preset?.fromDelta?.y).toBe(8);
  });

  it("resolves enter:fade-up-lg with y=48", () => {
    const preset = resolvePreset("enter", "fade-up-lg", {});
    expect(preset).not.toBeNull();
    expect(preset?.fromDelta?.y).toBe(48);
  });

  it("resolves enter:fade-up-xl with y=80", () => {
    const preset = resolvePreset("enter", "fade-up-xl", {});
    expect(preset).not.toBeNull();
    expect(preset?.fromDelta?.y).toBe(80);
  });

  it("resolves exit:pop-lg with correct scale", () => {
    const preset = resolvePreset("exit", "pop-lg", {});
    expect(preset).not.toBeNull();
    expect(preset?.toDelta?.opacity).toBe(-1);
    expect(preset?.toDelta?.scale).toBe(0.7 - 1);
  });

  it("recognises slide-left-xl as a known enter preset", () => {
    expect(isKnownPreset("enter", "slide-left-xl")).toBe(true);
  });

  it("does not recognise non-existent xxl intensity", () => {
    expect(isKnownPreset("enter", "fade-up-xxl")).toBe(false);
  });

  it("resolves enter:bounce-in-xl keyframes with y=80", () => {
    const result = resolvePreset("enter", "bounce-in-xl", {});
    expect(result).not.toBeNull();
    expect(result?.keyframes).toBeDefined();
    expect(result!.keyframes!.length).toBe(4);
    expect(result!.keyframes![0]!.state.y).toBe(80);
  });

  // --- 2xl intensity tests ---

  it("resolves enter:fade-up-2xl with y=120", () => {
    const preset = resolvePreset("enter", "fade-up-2xl", {});
    expect(preset).not.toBeNull();
    expect(preset?.fromDelta?.y).toBe(120);
  });

  it("recognises slide-left-2xl as a known enter preset", () => {
    expect(isKnownPreset("enter", "slide-left-2xl")).toBe(true);
  });

  it("resolves enter:bounce-in-2xl keyframes with y=120", () => {
    const result = resolvePreset("enter", "bounce-in-2xl", {});
    expect(result).not.toBeNull();
    expect(result?.keyframes).toBeDefined();
    expect(result!.keyframes![0]!.state.y).toBe(120);
  });

  // --- Duration scaling tests ---

  it("scales duration for lg intensity (1.25x)", () => {
    const base = resolvePreset("enter", "fade-up", {});
    const lg = resolvePreset("enter", "fade-up-lg", {});
    expect(base).not.toBeNull();
    expect(lg).not.toBeNull();
    expect(lg!.defaults.durationMs).toBe(Math.round(base!.defaults.durationMs * 1.25));
  });

  it("scales duration for xl intensity (1.5x)", () => {
    const base = resolvePreset("enter", "fade-up", {});
    const xl = resolvePreset("enter", "fade-up-xl", {});
    expect(base).not.toBeNull();
    expect(xl).not.toBeNull();
    expect(xl!.defaults.durationMs).toBe(Math.round(base!.defaults.durationMs * 1.5));
  });

  it("scales duration for 2xl intensity (1.75x)", () => {
    const base = resolvePreset("enter", "fade-up", {});
    const xxl = resolvePreset("enter", "fade-up-2xl", {});
    expect(base).not.toBeNull();
    expect(xxl).not.toBeNull();
    expect(xxl!.defaults.durationMs).toBe(Math.round(base!.defaults.durationMs * 1.75));
  });

  it("keeps sm duration same as base (1.0x)", () => {
    const base = resolvePreset("enter", "fade-up", {});
    const sm = resolvePreset("enter", "fade-up-sm", {});
    expect(sm!.defaults.durationMs).toBe(base!.defaults.durationMs);
  });

  // --- New preset tests ---

  it("resolves enter:zoom-in preset", () => {
    const preset = resolvePreset("enter", "zoom-in", {});
    expect(preset).not.toBeNull();
    expect(preset?.fromDelta?.opacity).toBe(-1);
    expect(preset?.fromDelta?.scale).toBe(1.15 - 1);
  });

  it("resolves enter:zoom-in-lg with correct scale", () => {
    const preset = resolvePreset("enter", "zoom-in-lg", {});
    expect(preset).not.toBeNull();
    expect(preset?.fromDelta?.scale).toBe(1.3 - 1);
  });

  it("resolves exit:bounce-out as keyframe preset", () => {
    const result = resolvePreset("exit", "bounce-out", {});
    expect(result).not.toBeNull();
    expect(result?.keyframes).toBeDefined();
    expect(result!.keyframes!.length).toBe(4);
    expect(result!.keyframes![0]!.offset).toBe(0);
    expect(result!.keyframes![3]!.state.opacity).toBe(-1);
  });

  it("resolves exit:drop-out as keyframe preset", () => {
    const result = resolvePreset("exit", "drop-out", {});
    expect(result).not.toBeNull();
    expect(result?.keyframes).toBeDefined();
    expect(result!.keyframes!.length).toBe(4);
    expect(result!.keyframes![3]!.state.opacity).toBe(-1);
  });

  it("resolves exit:elastic-scale as keyframe preset", () => {
    const result = resolvePreset("exit", "elastic-scale", {});
    expect(result).not.toBeNull();
    expect(result?.keyframes).toBeDefined();
    expect(result!.keyframes!.length).toBe(4);
    expect(result!.keyframes![3]!.state.opacity).toBe(-1);
    expect(result!.keyframes![3]!.state.scale).toBe(0.85 - 1);
  });

  it("resolves hover:tilt preset", () => {
    const preset = resolvePreset("hover", "tilt", {});
    expect(preset).not.toBeNull();
    expect(preset?.toDelta?.rotate).toBe(3);
  });

  it("resolves press:squish preset", () => {
    const preset = resolvePreset("press", "squish", {});
    expect(preset).not.toBeNull();
    expect(preset?.toDelta?.scale).toBe(0.92 - 1);
  });

  it("resolves focus:grow preset", () => {
    const preset = resolvePreset("focus", "grow", {});
    expect(preset).not.toBeNull();
    expect(preset?.toDelta?.scale).toBe(1.05 - 1);
  });

  it("recognises new presets as known", () => {
    expect(isKnownPreset("enter", "zoom-in")).toBe(true);
    expect(isKnownPreset("exit", "bounce-out")).toBe(true);
    expect(isKnownPreset("exit", "drop-out")).toBe(true);
    expect(isKnownPreset("exit", "elastic-scale")).toBe(true);
    expect(isKnownPreset("hover", "tilt")).toBe(true);
    expect(isKnownPreset("press", "squish")).toBe(true);
    expect(isKnownPreset("focus", "grow")).toBe(true);
  });

  it("recognises intensity variants for new presets", () => {
    expect(isKnownPreset("enter", "zoom-in-xl")).toBe(true);
    expect(isKnownPreset("exit", "bounce-out-lg")).toBe(true);
    expect(isKnownPreset("exit", "drop-out-2xl")).toBe(true);
    expect(isKnownPreset("exit", "elastic-scale-sm")).toBe(true);
  });
});
