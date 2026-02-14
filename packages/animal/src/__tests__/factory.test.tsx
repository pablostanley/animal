// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { A, Stagger } from "../react";

describe("A.* components", () => {
  it("renders the correct HTML element", () => {
    const { container } = render(<A.div data-testid="el" />);
    expect(container.firstChild!.nodeName).toBe("DIV");
    cleanup();

    const { container: c2 } = render(<A.button data-testid="el" />);
    expect(c2.firstChild!.nodeName).toBe("BUTTON");
    cleanup();

    const { container: c3 } = render(<A.span data-testid="el" />);
    expect(c3.firstChild!.nodeName).toBe("SPAN");
    cleanup();
  });

  it("passes through standard HTML props", () => {
    const { container } = render(
      <A.div className="test-class" id="test-id" aria-label="test-label" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toBe("test-class");
    expect(el.id).toBe("test-id");
    expect(el.getAttribute("aria-label")).toBe("test-label");
    cleanup();
  });

  it("forwards refs correctly", () => {
    const ref = React.createRef<HTMLElement>();
    render(<A.div ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current!.nodeName).toBe("DIV");
    cleanup();
  });

  it("calls original event handlers alongside animation logic", () => {
    const onPointerEnter = vi.fn();
    const onPointerLeave = vi.fn();
    const onPointerDown = vi.fn();
    const onPointerUp = vi.fn();
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    const { container } = render(
      <A.div
        an="hover:grow press:shrink focus:ring"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    );
    const el = container.firstChild as HTMLElement;

    fireEvent.pointerEnter(el);
    expect(onPointerEnter).toHaveBeenCalledTimes(1);

    fireEvent.pointerLeave(el);
    expect(onPointerLeave).toHaveBeenCalledTimes(1);

    fireEvent.pointerDown(el);
    expect(onPointerDown).toHaveBeenCalledTimes(1);

    fireEvent.pointerUp(el);
    expect(onPointerUp).toHaveBeenCalledTimes(1);

    fireEvent.focus(el);
    expect(onFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(el);
    expect(onBlur).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it("applies enter styles on mount (WAAPI fallback path)", () => {
    const { container } = render(<A.div an="enter:fade-up" />);
    const el = container.firstChild as HTMLElement;
    // In jsdom, el.animate is not available, so the fallback path applies
    // the final "to" state directly. For fade-up, the resting state should
    // have opacity applied.
    expect(el.style.opacity).not.toBe("");
    cleanup();
  });

  it("skips enter animation when initial={false}", () => {
    const { container } = render(
      <A.div an="enter:fade-up" initial={false} />
    );
    const el = container.firstChild as HTMLElement;
    // With initial=false, the element should still end up at the resting
    // "to" state (styles applied), just without animation.
    expect(el.style.opacity).not.toBe("");
    cleanup();
  });

  it("fires onAnimationComplete for enter (WAAPI fallback)", async () => {
    const onComplete = vi.fn();
    render(
      <A.div an="enter:fade-up" onAnimationComplete={onComplete} />
    );
    // In the WAAPI fallback, animation.finished resolves immediately.
    // Wait a microtask for the .then() to fire.
    await vi.waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith("enter");
    });
    cleanup();
  });

  it("renders inside Stagger without errors", () => {
    const { container } = render(
      <Stagger stagger={80}>
        <A.div an="enter:fade-up">Item 1</A.div>
        <A.div an="enter:fade-up">Item 2</A.div>
      </Stagger>
    );
    const children = container.querySelectorAll("div");
    expect(children.length).toBeGreaterThanOrEqual(2);
    cleanup();
  });

  it("applies in-view token without crashing (jsdom fallback)", () => {
    const { container } = render(
      <A.div an="enter:fade-up in-view">Content</A.div>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.nodeName).toBe("DIV");
    cleanup();
  });

  it("renders with loop token without crashing", () => {
    const { container } = render(
      <A.div an="enter:fade loop">Looping</A.div>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.nodeName).toBe("DIV");
    cleanup();
  });

  it("renders with keyframe preset without crashing", () => {
    const { container } = render(
      <A.div an="enter:bounce-in">Bouncing</A.div>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.nodeName).toBe("DIV");
    cleanup();
  });

  it("renders with scroll-progress without crashing", () => {
    const { container } = render(
      <A.div an="enter:fade-up scroll-progress">Scroll</A.div>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.nodeName).toBe("DIV");
    cleanup();
  });
});
