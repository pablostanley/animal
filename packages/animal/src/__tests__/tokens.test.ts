import { describe, expect, it } from "vitest";
import { parseAnimalTokens } from "../tokens";

describe("parseAnimalTokens()", () => {
  it("parses an unscoped enter preset and global options", () => {
    const config = parseAnimalTokens("fade-up duration-240 delay-80 ease-in-out");
    expect(config.enter?.preset).toBe("fade-up");
    expect(config.options?.duration).toBe(240);
    expect(config.options?.delay).toBe(80);
    expect(config.options?.easing).toBe("ease-in-out");
  });

  it("supports `ease` shorthand", () => {
    const config = parseAnimalTokens("fade ease duration-120");
    expect(config.enter?.preset).toBe("fade");
    expect(config.options?.easing).toBe("ease");
  });

  it("treats unknown spring easings as unknown tokens", () => {
    const config = parseAnimalTokens("fade ease-spring-typo");
    expect(config.enter?.preset).toBe("fade");
    expect(config.options?.easing).toBeUndefined();
    expect(config.unknownTokens).toEqual(["ease-spring-typo"]);
  });

  it("parses phase-scoped presets and options", () => {
    const config = parseAnimalTokens("hover:lift hover:duration-100 press:compress press:delay-0");
    expect(config.hover?.preset).toBe("lift");
    expect(config.hover?.options?.duration).toBe(100);
    expect(config.press?.preset).toBe("compress");
    expect(config.press?.options?.delay).toBe(0);
  });

  it("parses param tokens (defaulting to enter when unscoped)", () => {
    const config = parseAnimalTokens("y-16 hover:y-6 scale-1.03");
    expect(config.enter?.params?.y).toBe(16);
    expect(config.enter?.params?.scale).toBe(1.03);
    expect(config.hover?.params?.y).toBe(6);
  });

  it("parses reduced motion tokens (global only)", () => {
    const config = parseAnimalTokens("rm-always fade");
    expect(config.options?.reducedMotion).toBe("always");
    expect(config.enter?.preset).toBe("fade");
  });

  it("parses rotate param tokens", () => {
    const config = parseAnimalTokens("rotate-45");
    expect(config.enter?.params?.rotate).toBe(45);
  });

  it("parses phase-scoped rotate token", () => {
    const config = parseAnimalTokens("hover:rotate-10");
    expect(config.hover?.params?.rotate).toBe(10);
  });

  it("parses negative rotate token", () => {
    const config = parseAnimalTokens("rotate--15");
    expect(config.enter?.params?.rotate).toBe(-15);
  });

  it("collects unknown tokens for agents to surface", () => {
    const config = parseAnimalTokens("enter:fade-up hover:wat foo:bar");
    expect(config.unknownTokens).toEqual(["hover:wat", "foo:bar"]);
  });

  it("parses stagger-100 token", () => {
    const config = parseAnimalTokens("fade-up stagger-100");
    expect(config.stagger).toBe(100);
  });

  it("parses in-view token", () => {
    const config = parseAnimalTokens("fade-up in-view");
    expect(config.inView).toBe(true);
  });

  it("parses in-view-repeat token", () => {
    const config = parseAnimalTokens("fade-up in-view-repeat");
    expect(config.inView).toEqual({ once: false });
  });

  it("parses ease-cubic-0.4-0-0.2-1", () => {
    const config = parseAnimalTokens("fade-up ease-cubic-0.4-0-0.2-1");
    expect(config.options?.easing).toBe("cubic-bezier(0.4, 0, 0.2, 1)");
  });

  it("parses phase-scoped cubic-bezier", () => {
    const config = parseAnimalTokens("enter:fade-up enter:ease-cubic-0.25-0.1-0.25-1");
    expect(config.enter?.options?.easing).toBe("cubic-bezier(0.25, 0.1, 0.25, 1)");
  });

  it("parses loop token", () => {
    const config = parseAnimalTokens("fade-up loop");
    expect(config.options?.loop).toBe(true);
  });

  it("parses loop-3 token", () => {
    const config = parseAnimalTokens("fade-up loop-3");
    expect(config.options?.loop).toBe(3);
  });

  it("parses phase-scoped loop", () => {
    const config = parseAnimalTokens("enter:loop");
    expect(config.enter?.options?.loop).toBe(true);
  });

  it("parses scroll-progress token", () => {
    const config = parseAnimalTokens("fade-up scroll-progress");
    expect(config.scrollProgress).toBe(true);
  });

  it("parses intensity variant enter:fade-up-lg", () => {
    const config = parseAnimalTokens("enter:fade-up-lg");
    expect(config.enter?.preset).toBe("fade-up-lg");
    expect(config.unknownTokens).toBeUndefined();
  });

  it("parses intensity variant enter:slide-left-sm with options", () => {
    const config = parseAnimalTokens("enter:slide-left-sm duration-200");
    expect(config.enter?.preset).toBe("slide-left-sm");
    expect(config.options?.duration).toBe(200);
  });
});
