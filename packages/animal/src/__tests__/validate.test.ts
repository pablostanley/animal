import { describe, expect, it } from "vitest";
import { validate } from "../validate";

describe("validate()", () => {
  it("returns valid for a correct token string", () => {
    const result = validate("fade-up duration-240 ease-out");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
    expect(result.parsed.enter?.preset).toBe("fade-up");
  });

  it("reports errors for unknown tokens", () => {
    const result = validate("fade-up bogus-token");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Unknown token: "bogus-token"');
  });

  it("warns when no presets are specified", () => {
    const result = validate("duration-240 ease-out");
    expect(result.valid).toBe(true);
    expect(result.warnings).toContain("No presets specified. The an string has no visual effect.");
  });

  it("warns about exit without enter preset", () => {
    const result = validate("exit:fade");
    expect(result.valid).toBe(true);
    expect(result.warnings).toContain(
      "Exit preset without enter preset. Element will exit but has no enter animation."
    );
  });

  it("does not warn about exit when enter is present", () => {
    const result = validate("enter:fade exit:fade");
    expect(result.valid).toBe(true);
    expect(result.warnings).toHaveLength(0);
  });

  it("validates in-view token as valid", () => {
    const result = validate("enter:fade-up in-view");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("validates cubic-bezier easing as valid", () => {
    const result = validate("enter:fade ease-cubic-0.4-0-0.2-1");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("validates loop token as valid", () => {
    const result = validate("enter:fade loop");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("validates scroll-progress as valid", () => {
    const result = validate("enter:fade-up scroll-progress");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
