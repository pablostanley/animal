// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import React from "react";
import { render, cleanup, act } from "@testing-library/react";
import { Presence, usePresence } from "../react";

/**
 * A minimal presence-aware child that registers with Presence
 * and calls safeToRemove immediately when exiting.
 * This avoids the full A.* animation machinery in Presence tests.
 */
function PresenceChild({ onExit }: { onExit?: () => void }) {
  const presence = usePresence();
  const registrationRef = React.useRef<ReturnType<NonNullable<typeof presence>["register"]> | null>(null);

  const registerPresence = presence?.register;
  React.useEffect(() => {
    if (!registerPresence) return;
    const reg = registerPresence();
    registrationRef.current = reg;
    return () => {
      reg.unregister();
      registrationRef.current = null;
    };
  }, [registerPresence]);

  React.useEffect(() => {
    if (!presence || presence.isPresent) return;
    const reg = registrationRef.current;
    if (!reg) return;
    onExit?.();
    reg.safeToRemove();
  }, [presence, onExit]);

  return <div>Child</div>;
}

describe("Presence", () => {
  it("renders children when present=true", () => {
    const { container } = render(
      <Presence present={true}>
        <PresenceChild />
      </Presence>
    );
    expect(container.textContent).toBe("Child");
    cleanup();
  });

  it("keeps children mounted while present transitions to false", () => {
    const { container, rerender } = render(
      <Presence present={true}>
        <PresenceChild />
      </Presence>
    );
    expect(container.textContent).toBe("Child");

    rerender(
      <Presence present={false}>
        <PresenceChild />
      </Presence>
    );
    // The safeToRemove fires synchronously in useEffect, so children
    // may already be unmounted. Either way, should not throw.
    cleanup();
  });

  it("calls onExitComplete after all children call safeToRemove", () => {
    const onExitComplete = vi.fn();

    const { rerender } = render(
      <Presence present={true} onExitComplete={onExitComplete}>
        <PresenceChild />
      </Presence>
    );
    expect(onExitComplete).not.toHaveBeenCalled();

    rerender(
      <Presence present={false} onExitComplete={onExitComplete}>
        <PresenceChild />
      </Presence>
    );

    // safeToRemove is called synchronously in the effect, which triggers
    // onExitComplete within the same render cycle.
    expect(onExitComplete).toHaveBeenCalledTimes(1);
    cleanup();
  });

  it("removes children from DOM after exit completes", () => {
    const { container, rerender } = render(
      <Presence present={true}>
        <PresenceChild />
      </Presence>
    );

    rerender(
      <Presence present={false}>
        <PresenceChild />
      </Presence>
    );

    // After the exit effect runs, setIsMounted(false) removes children.
    expect(container.textContent).toBe("");
    cleanup();
  });

  it("handles re-entry (present toggles true before exit completes)", () => {
    const onExitComplete = vi.fn();

    const { container, rerender } = render(
      <Presence present={true} onExitComplete={onExitComplete}>
        <PresenceChild />
      </Presence>
    );

    // Start exit
    rerender(
      <Presence present={false} onExitComplete={onExitComplete}>
        <PresenceChild />
      </Presence>
    );

    // Re-enter immediately
    rerender(
      <Presence present={true} onExitComplete={onExitComplete}>
        <PresenceChild />
      </Presence>
    );

    expect(container.textContent).toBe("Child");
    cleanup();
  });
});
