import * as React from "react";
import type { AnimalConfig, EasingName, MotionState, PartialMotionState, PhaseConfig, PresetPhase } from "../types";
import { parseAnimalTokens } from "../tokens";
import { resolvePreset } from "../presets";
import { applyDelta, applyStyles, animateBetween, readCurrentState } from "./waapi";
import { useReducedMotion } from "./useReducedMotion";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { usePresence } from "./Presence";

type Affects = ReadonlyArray<"transform" | "opacity">;
type PresenceRegistration = Readonly<{ safeToRemove: () => void; unregister: () => void }>;

type ResolvedPhase = Readonly<{
  phase: PresetPhase;
  preset: string;
  fromDelta?: PartialMotionState;
  toDelta?: PartialMotionState;
  affects: Affects;
  options: Readonly<{ durationMs: number; delayMs: number; easing: EasingName }>;
}>;

function mergePhaseOptions(
  defaults: Readonly<{ durationMs: number; delayMs: number; easing: EasingName }>,
  global: AnimalConfig["options"] | undefined,
  local: PhaseConfig | undefined
): Readonly<{ durationMs: number; delayMs: number; easing: EasingName }> {
  const localOpts = local?.options;
  return {
    durationMs: (localOpts?.duration ?? global?.duration ?? defaults.durationMs) as number,
    delayMs: (localOpts?.delay ?? global?.delay ?? defaults.delayMs) as number,
    easing: (localOpts?.easing ?? global?.easing ?? defaults.easing) as EasingName,
  };
}

function resolvePhase(config: AnimalConfig, phase: PresetPhase): ResolvedPhase | null {
  const phaseConfig = config[phase];
  const preset = phaseConfig?.preset;
  if (!preset) return null;

  const resolved = resolvePreset(phase, preset, phaseConfig.params);
  if (!resolved) return null;

  return {
    phase,
    preset,
    affects: resolved.affects,
    options: mergePhaseOptions(resolved.defaults, config.options, phaseConfig),
    ...(resolved.fromDelta !== undefined ? { fromDelta: resolved.fromDelta } : {}),
    ...(resolved.toDelta !== undefined ? { toDelta: resolved.toDelta } : {}),
  };
}

function composeTarget(base: MotionState, deltas: Array<PartialMotionState | undefined>): MotionState {
  let next = base;
  for (const d of deltas) next = applyDelta(next, d);
  return next;
}

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  try {
    // eslint-disable-next-line no-param-reassign
    (ref as React.MutableRefObject<T | null>).current = value;
  } catch {
    // ignore
  }
}

export type AnimalElementProps<TTag extends keyof React.JSX.IntrinsicElements> =
  React.JSX.IntrinsicElements[TTag] & {
  an?: string;
  initial?: boolean;
};

export function createAnimalComponent<TTag extends keyof React.JSX.IntrinsicElements>(tag: TTag) {
  type Props = AnimalElementProps<TTag>;

  const Component = React.forwardRef<HTMLElement, Props>(function AnimalElement(
    {
      an,
      initial = true,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onLostPointerCapture,
      onFocus,
      onBlur,
      ...rest
    },
    forwardedRef
  ) {
    const localRef = React.useRef<HTMLElement | null>(null);
    const presence = usePresence();
    const presenceRegistrationRef = React.useRef<PresenceRegistration | null>(null);

    const config = React.useMemo(() => parseAnimalTokens(an), [an]);
    const reducedMotion = useReducedMotion(config.options?.reducedMotion);

    const enter = React.useMemo(() => resolvePhase(config, "enter"), [config]);
    const exit = React.useMemo(() => resolvePhase(config, "exit"), [config]);
    const hover = React.useMemo(() => resolvePhase(config, "hover"), [config]);
    const press = React.useMemo(() => resolvePhase(config, "press"), [config]);
    const focus = React.useMemo(() => resolvePhase(config, "focus"), [config]);

    const baseRef = React.useRef<MotionState | null>(null);
    const animationRef = React.useRef<Animation | null>(null);

    const isFirstMountRef = React.useRef(true);
    const flagsRef = React.useRef({ hover: false, press: false, focus: false });
    const pressedPointerIdRef = React.useRef<number | null>(null);

    const stopAnimation = React.useCallback(() => {
      const anim = animationRef.current;
      if (!anim) return;
      try {
        // Commit the current styles (if supported) to avoid snapping.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (anim as any).commitStyles?.();
      } catch {
        // ignore
      }
      try {
        anim.cancel();
      } catch {
        // ignore
      }
      animationRef.current = null;
    }, []);

    const animateTo = React.useCallback(
      (to: MotionState, phaseOptions: ResolvedPhase["options"], affects: Affects) => {
        const el = localRef.current;
        if (!el) return;

        // Capture current state with any in-flight animation before we cancel it.
        const from = readCurrentState(el);
        stopAnimation();

        if (reducedMotion || phaseOptions.durationMs <= 0) {
          applyStyles(el, to, affects);
          return;
        }

        const { animation } = animateBetween(
          el,
          from,
          to,
          { durationMs: phaseOptions.durationMs, delayMs: phaseOptions.delayMs, easing: phaseOptions.easing },
          affects
        );

        animationRef.current = animation;
        animation.finished
          .then(() => {
            applyStyles(el, to, affects);
          })
          .catch(() => {
            // ignore cancellations
          });
      },
      [reducedMotion, stopAnimation]
    );

    const setInteraction = React.useCallback(
      (phase: "hover" | "press" | "focus", active: boolean, phaseSpec: ResolvedPhase | null) => {
        const el = localRef.current;
        const base = baseRef.current;
        if (!el || !base || !phaseSpec) return;

        flagsRef.current = { ...flagsRef.current, [phase]: active };
        const deltas: Array<PartialMotionState | undefined> = [];
        const affectsSet = new Set<"transform" | "opacity">();

        if (flagsRef.current.hover) {
          deltas.push(hover?.toDelta);
          for (const a of hover?.affects ?? []) affectsSet.add(a);
        }
        if (flagsRef.current.press) {
          deltas.push(press?.toDelta);
          for (const a of press?.affects ?? []) affectsSet.add(a);
        }
        if (flagsRef.current.focus) {
          deltas.push(focus?.toDelta);
          for (const a of focus?.affects ?? []) affectsSet.add(a);
        }

        const target = composeTarget(base, deltas);
        const affects = Array.from(affectsSet);
        animateTo(target, phaseSpec.options, affects.length > 0 ? affects : ["transform"]);
      },
      [animateTo, focus, hover, press]
    );

    const startPress = React.useCallback(
      (e: React.PointerEvent) => {
        if (!press) return;
        if (pressedPointerIdRef.current !== null) return;
        pressedPointerIdRef.current = e.pointerId;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        setInteraction("press", true, press);
      },
      [press, setInteraction]
    );

    const endPress = React.useCallback(
      (e: React.PointerEvent) => {
        if (!press) return;
        if (pressedPointerIdRef.current === null) return;
        if (pressedPointerIdRef.current !== e.pointerId) return;
        pressedPointerIdRef.current = null;
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        setInteraction("press", false, press);
      },
      [press, setInteraction]
    );

    // Register with a Presence boundary once per mount so Presence can wait for all exiting children.
    const registerPresence = presence?.register;
    React.useEffect(() => {
      if (!registerPresence) return;
      const reg = registerPresence();
      presenceRegistrationRef.current = reg;
      return () => {
        reg.unregister();
        presenceRegistrationRef.current = null;
      };
    }, [registerPresence]);

    // Enter animation: run before paint to prevent flicker.
    useIsomorphicLayoutEffect(() => {
      const el = localRef.current;
      if (!el) return;

      const base = readCurrentState(el);
      baseRef.current = base;

      if (!enter) return;

      // Skip the enter animation on first mount when initial is false.
      const skipEnter = !initial && isFirstMountRef.current;
      isFirstMountRef.current = false;

      const to = composeTarget(base, [enter.toDelta]);

      if (skipEnter) {
        applyStyles(el, to, enter.affects);
        baseRef.current = to;
        return;
      }

      const from = composeTarget(base, [enter.fromDelta]);

      if (reducedMotion || enter.options.durationMs <= 0) {
        applyStyles(el, to, enter.affects);
        baseRef.current = to;
        return;
      }

      // Set base to the enter target immediately so interactions compose correctly.
      baseRef.current = to;

      applyStyles(el, from, enter.affects);
      const { animation } = animateBetween(el, from, to, enter.options, enter.affects);
      animationRef.current = animation;
      animation.finished
        .then(() => {
          applyStyles(el, to, enter.affects);
        })
        .catch(() => {
          // ignore cancellations
        });
    }, [enter, initial, reducedMotion]);

    // Exit animation (presence-aware).
    React.useEffect(() => {
      const el = localRef.current;
      const base = baseRef.current;
      if (!presence || !el || !base) return;

      if (presence.isPresent) return;

      const reg = presenceRegistrationRef.current;
      if (!reg) return;

      if (!exit) {
        reg.safeToRemove();
        return;
      }

      const to = composeTarget(base, [exit.toDelta]);
      const from = readCurrentState(el);

      stopAnimation();

      if (reducedMotion || exit.options.durationMs <= 0) {
        applyStyles(el, to, exit.affects);
        reg.safeToRemove();
        return;
      }

      const { animation } = animateBetween(el, from, to, exit.options, exit.affects);
      animationRef.current = animation;
      animation.finished
        .then(() => {
          applyStyles(el, to, exit.affects);
          reg.safeToRemove();
        })
        .catch(() => {
          reg.safeToRemove();
        });
    }, [exit, presence, reducedMotion, stopAnimation]);

    return React.createElement(tag, {
      ...rest,
      ref: (node: HTMLElement | null) => {
        localRef.current = node;
        setRef(forwardedRef, node);
      },
      onPointerEnter: (e: React.PointerEvent) => {
        onPointerEnter?.(e as never);
        if (hover) setInteraction("hover", true, hover);
      },
      onPointerLeave: (e: React.PointerEvent) => {
        onPointerLeave?.(e as never);
        if (hover) setInteraction("hover", false, hover);
      },
      onPointerDown: (e: React.PointerEvent) => {
        onPointerDown?.(e as never);
        startPress(e);
      },
      onPointerUp: (e: React.PointerEvent) => {
        onPointerUp?.(e as never);
        endPress(e);
      },
      onPointerCancel: (e: React.PointerEvent) => {
        onPointerCancel?.(e as never);
        endPress(e);
      },
      onLostPointerCapture: (e: React.PointerEvent) => {
        onLostPointerCapture?.(e as never);
        endPress(e);
      },
      onFocus: (e: React.FocusEvent) => {
        onFocus?.(e as never);
        if (focus) setInteraction("focus", true, focus);
      },
      onBlur: (e: React.FocusEvent) => {
        onBlur?.(e as never);
        if (focus) setInteraction("focus", false, focus);
      },
    });
  });

  Component.displayName = `Animal.${String(tag)}`;
  return Component;
}
