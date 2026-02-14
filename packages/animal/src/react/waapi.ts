import { CSS_EASINGS, SPRING_PRESETS, getSpringPresetName, isSpringEasing } from "../easings";
import { simulateSpring } from "../spring";
import type { EasingName, KeyframeStep, MotionState, PartialMotionState, SpringPresetName } from "../types";

type Affects = ReadonlyArray<"transform" | "opacity">;

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type WillChangeState = Readonly<{ base: string; token: number }>;
const WILL_CHANGE_STATE = new WeakMap<HTMLElement, WillChangeState>();
let WILL_CHANGE_TOKEN = 0;

export function applyDelta(base: MotionState, delta: PartialMotionState | undefined): MotionState {
  if (!delta) return base;
  return {
    x: base.x + (delta.x ?? 0),
    y: base.y + (delta.y ?? 0),
    scale: base.scale + (delta.scale ?? 0),
    rotate: base.rotate + (delta.rotate ?? 0),
    opacity: base.opacity + (delta.opacity ?? 0),
  };
}

export function buildTransform(s: MotionState): string {
  // Keep this predictable and easy to parse back from computed styles.
  return `translate(${s.x}px, ${s.y}px) rotate(${s.rotate}deg) scale(${s.scale})`;
}

export function applyStyles(el: HTMLElement, state: MotionState, affects: Affects) {
  if (affects.includes("transform")) el.style.transform = buildTransform(state);
  if (affects.includes("opacity")) el.style.opacity = String(state.opacity);
}

type ParsedTransform = Readonly<Pick<MotionState, "x" | "y" | "scale" | "rotate">>;

function parseNumbers(csv: string): number[] {
  return csv
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((n) => Number.isFinite(n));
}

function parseTransform(transform: string): ParsedTransform {
  if (!transform || transform === "none") return { x: 0, y: 0, scale: 1, rotate: 0 };

  // matrix(a, b, c, d, e, f)
  if (transform.startsWith("matrix(")) {
    const inner = transform.slice("matrix(".length, -1);
    const nums = parseNumbers(inner);
    if (nums.length !== 6) return { x: 0, y: 0, scale: 1, rotate: 0 };
    const a = nums[0]!;
    const b = nums[1]!;
    const e = nums[4]!;
    const f = nums[5]!;
    const scaleX = Math.sqrt(a * a + b * b);
    const rotation = Math.atan2(b, a) * (180 / Math.PI);
    return { x: e, y: f, scale: scaleX || 1, rotate: rotation || 0 };
  }

  // matrix3d(...16 values...)
  if (transform.startsWith("matrix3d(")) {
    const inner = transform.slice("matrix3d(".length, -1);
    const m = parseNumbers(inner);
    if (m.length !== 16) return { x: 0, y: 0, scale: 1, rotate: 0 };

    const a = m[0]!;
    const b = m[1]!;
    const x = m[12]!;
    const y = m[13]!;

    const scaleX = Math.sqrt(a * a + b * b);
    const rotation = Math.atan2(b, a) * (180 / Math.PI);
    return { x, y, scale: scaleX || 1, rotate: rotation || 0 };
  }

  return { x: 0, y: 0, scale: 1, rotate: 0 };
}

export function readCurrentState(el: HTMLElement): MotionState {
  const cs = window.getComputedStyle(el);
  const opacity = Number.parseFloat(cs.opacity || "1");
  const t = parseTransform(cs.transform || "none");
  return {
    x: t.x,
    y: t.y,
    scale: t.scale,
    rotate: t.rotate,
    opacity: Number.isFinite(opacity) ? opacity : 1,
  };
}

type SpringCacheEntry = Readonly<{ values: number[] }>;
const SPRING_CACHE = new Map<SpringPresetName, SpringCacheEntry>();

function getSpringValues(name: SpringPresetName): number[] {
  const cached = SPRING_CACHE.get(name);
  if (cached) return cached.values;

  const params = SPRING_PRESETS[name];
  const sim = simulateSpring(params);
  const values = sim.values;
  SPRING_CACHE.set(name, { values });
  return values;
}

export type AnimateOptions = Readonly<{
  durationMs: number;
  delayMs: number;
  easing: EasingName;
  loop?: boolean | number;
}>;

export type AnimateResult = Readonly<{
  animation: Animation;
  to: MotionState;
}>;

export function animateBetween(
  el: HTMLElement,
  from: MotionState,
  to: MotionState,
  options: AnimateOptions,
  affects: Affects
): AnimateResult {
  if (typeof el.animate !== "function") {
    applyStyles(el, to, affects);
    const animation = {
      finished: Promise.resolve(),
      cancel: () => {},
    } as unknown as Animation;
    return { animation, to };
  }

  const willChange = affects.join(", ");
  const currentState = WILL_CHANGE_STATE.get(el);
  const baseWillChange = currentState?.base ?? el.style.willChange;
  const token = (WILL_CHANGE_TOKEN += 1);
  WILL_CHANGE_STATE.set(el, { base: baseWillChange, token });
  el.style.willChange = baseWillChange ? `${baseWillChange}, ${willChange}` : willChange;

  const duration = Math.max(0, options.durationMs);
  const delay = Math.max(0, options.delayMs);
  const fill: FillMode = "both";
  const iterations = options.loop === true ? Infinity : typeof options.loop === "number" ? options.loop : 1;

  if (isSpringEasing(options.easing)) {
    const preset = getSpringPresetName(options.easing);
    const springValues = getSpringValues(preset);
    const last = springValues.length - 1;
    const keyframes: Keyframe[] = springValues.map((p, idx) => {
      const t = p;
      const opacityT = clamp(t, 0, 1);
      const frame: Keyframe = { offset: last <= 0 ? 1 : idx / last };

      if (affects.includes("transform")) {
        const x = lerp(from.x, to.x, t);
        const y = lerp(from.y, to.y, t);
        const scale = Math.max(0.0001, lerp(from.scale, to.scale, t));
        const rotate = lerp(from.rotate, to.rotate, t);
        frame.transform = buildTransform({ ...to, x, y, scale, rotate });
      }

      if (affects.includes("opacity")) {
        frame.opacity = lerp(from.opacity, to.opacity, opacityT);
      }

      return frame;
    });

    const animation = el.animate(keyframes, { duration, delay, easing: "linear", fill, iterations, direction: "normal" });
    animation.finished.finally(() => {
      const state = WILL_CHANGE_STATE.get(el);
      if (!state || state.token !== token) return;
      el.style.willChange = state.base;
      WILL_CHANGE_STATE.delete(el);
    });
    return { animation, to };
  }

  // cubic-bezier(...) strings pass through as valid CSS easing values for WAAPI.
  const easing = CSS_EASINGS[options.easing as keyof typeof CSS_EASINGS] ?? options.easing;
  const keyframes: Keyframe[] = [];
  const fromFrame: Keyframe = {};
  const toFrame: Keyframe = {};

  if (affects.includes("transform")) {
    fromFrame.transform = buildTransform(from);
    toFrame.transform = buildTransform(to);
  }

  if (affects.includes("opacity")) {
    fromFrame.opacity = from.opacity;
    toFrame.opacity = to.opacity;
  }

  keyframes.push(fromFrame, toFrame);
  const animation = el.animate(keyframes, { duration, delay, easing, fill, iterations });
  animation.finished.finally(() => {
    const state = WILL_CHANGE_STATE.get(el);
    if (!state || state.token !== token) return;
    el.style.willChange = state.base;
    WILL_CHANGE_STATE.delete(el);
  });
  return { animation, to };
}

export function animateKeyframes(
  el: HTMLElement,
  keyframeSteps: readonly KeyframeStep[],
  base: MotionState,
  options: AnimateOptions,
  affects: Affects
): AnimateResult {
  const lastStep = keyframeSteps[keyframeSteps.length - 1];
  const to = lastStep ? applyDelta(base, lastStep.state) : base;

  if (typeof el.animate !== "function") {
    applyStyles(el, to, affects);
    const animation = {
      finished: Promise.resolve(),
      cancel: () => {},
    } as unknown as Animation;
    return { animation, to };
  }

  const waapiKeyframes: Keyframe[] = keyframeSteps.map(({ offset, state }) => {
    const composed = applyDelta(base, state);
    const frame: Keyframe = { offset };
    if (affects.includes("transform")) frame.transform = buildTransform(composed);
    if (affects.includes("opacity")) frame.opacity = composed.opacity;
    return frame;
  });

  const duration = Math.max(0, options.durationMs);
  const delay = Math.max(0, options.delayMs);
  const iterations = options.loop === true ? Infinity : typeof options.loop === "number" ? options.loop : 1;

  const willChange = affects.join(", ");
  const currentState = WILL_CHANGE_STATE.get(el);
  const baseWillChange = currentState?.base ?? el.style.willChange;
  const token = (WILL_CHANGE_TOKEN += 1);
  WILL_CHANGE_STATE.set(el, { base: baseWillChange, token });
  el.style.willChange = baseWillChange ? `${baseWillChange}, ${willChange}` : willChange;

  const animation = el.animate(waapiKeyframes, {
    duration, delay, easing: "linear", fill: "both", iterations,
  });

  animation.finished.finally(() => {
    const state = WILL_CHANGE_STATE.get(el);
    if (!state || state.token !== token) return;
    el.style.willChange = state.base;
    WILL_CHANGE_STATE.delete(el);
  });

  return { animation, to };
}

export function interpolateState(from: MotionState, to: MotionState, progress: number): MotionState {
  const t = Math.max(0, Math.min(1, progress));
  return {
    x: lerp(from.x, to.x, t),
    y: lerp(from.y, to.y, t),
    scale: lerp(from.scale, to.scale, t),
    rotate: lerp(from.rotate, to.rotate, t),
    opacity: lerp(from.opacity, to.opacity, t),
  };
}
