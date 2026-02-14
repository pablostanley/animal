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
});
