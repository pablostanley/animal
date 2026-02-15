"use client";

import * as React from "react";
import { simulateSpring, SPRING_PRESETS, CSS_EASINGS } from "@vercel/animal";
import { A } from "@vercel/animal/react";
import { CopyButton } from "@/components/CopyButton";

/* -------------------------------------------------------------------------- */
/*  Cubic-bezier helpers                                                      */
/* -------------------------------------------------------------------------- */

type BezierPoints = [number, number, number, number];

const BEZIER_MAP: Record<string, BezierPoints> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
};

function cubicBezier(
  t: number,
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number
): number {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  let t2 = t;
  for (let i = 0; i < 8; i++) {
    const x = ((ax * t2 + bx) * t2 + cx) * t2 - t;
    if (Math.abs(x) < 1e-6) break;
    const dx = (3 * ax * t2 + 2 * bx) * t2 + cx;
    if (Math.abs(dx) < 1e-6) break;
    t2 -= x / dx;
  }
  return ((ay * t2 + by) * t2 + cy) * t2;
}

function bezierSvgPath(points: BezierPoints, w: number, h: number): string {
  const [p1x, p1y, p2x, p2y] = points;
  const steps = 64;
  const coords: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = cubicBezier(t, p1x, p1y, p2x, p2y);
    const sx = (t * w).toFixed(2);
    const sy = (h - y * h).toFixed(2);
    coords.push(`${i === 0 ? "M" : "L"}${sx},${sy}`);
  }
  return coords.join(" ");
}

/* -------------------------------------------------------------------------- */
/*  Spring SVG helper                                                         */
/* -------------------------------------------------------------------------- */

function springSvgPath(
  values: number[],
  w: number,
  h: number
): string {
  if (values.length === 0) return "";
  const coords: string[] = [];
  for (let i = 0; i < values.length; i++) {
    const x = (i / (values.length - 1)) * w;
    const y = h - values[i]! * h;
    coords.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return coords.join(" ");
}

/* -------------------------------------------------------------------------- */
/*  Shared card style                                                         */
/* -------------------------------------------------------------------------- */

const CARD =
  "rounded-2xl border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.03]";

/* -------------------------------------------------------------------------- */
/*  CSS Easing Card                                                           */
/* -------------------------------------------------------------------------- */

function CSSEasingCard({ name }: { name: string }) {
  const points = BEZIER_MAP[name]!;
  const token = `ease-${name}`;
  const svgW = 200;
  const svgH = 150;
  const path = bezierSvgPath(points, svgW, svgH);

  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const rafRef = React.useRef<number>(0);

  const play = React.useCallback(() => {
    if (playing) return;
    setPlaying(true);
    const start = performance.now();
    const dur = 800;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      setProgress(t);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPlaying(false);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [playing]);

  React.useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const dotY = cubicBezier(progress, ...points);

  return (
    <div className={`${CARD} flex flex-col gap-3 p-4`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-black dark:text-white">
          {name}
        </span>
        <span className="font-mono text-[11px] text-black/40 dark:text-white/40">
          cubic-bezier({points.join(", ")})
        </span>
      </div>

      <button
        type="button"
        onClick={play}
        className="relative cursor-pointer"
        aria-label={`Play ${name} easing animation`}
      >
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          <line
            x1="0" y1={svgH} x2={svgW} y2="0"
            stroke="currentColor"
            className="text-black/5 dark:text-white/5"
            strokeDasharray="4 4"
          />
          {/* Curve */}
          <path
            d={path}
            fill="none"
            stroke="currentColor"
            className="text-black/70 dark:text-white/70"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Animated dot */}
          {playing && (
            <circle
              cx={progress * svgW}
              cy={svgH - dotY * svgH}
              r="5"
              fill="currentColor"
              className="text-black dark:text-white"
            />
          )}
        </svg>
      </button>

      <div className="flex items-center justify-between gap-2">
        <code className="truncate rounded-lg bg-black/5 px-3 py-2 font-mono text-xs text-black/70 dark:bg-white/10 dark:text-white/70">
          {token}
        </code>
        <CopyButton text={token} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Spring Preset Card                                                        */
/* -------------------------------------------------------------------------- */

function SpringPresetCard({
  name,
  params,
}: {
  name: string;
  params: { stiffness: number; damping: number; mass: number };
}) {
  const token = `ease-spring-${name}`;
  const svgW = 200;
  const svgH = 150;
  const sim = React.useMemo(
    () => simulateSpring(params),
    [params]
  );
  const path = springSvgPath(sim.values, svgW, svgH);

  const [nonce, setNonce] = React.useState(0);

  return (
    <div className={`${CARD} flex flex-col gap-3 p-4`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-black dark:text-white">
          {name}
        </span>
        <span className="font-mono text-[11px] text-black/40 dark:text-white/40">
          {sim.durationMs}ms
        </span>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-black/50 dark:text-white/50">
        <span>stiffness: {params.stiffness}</span>
        <span className="text-black/20 dark:text-white/20">|</span>
        <span>damping: {params.damping}</span>
        <span className="text-black/20 dark:text-white/20">|</span>
        <span>mass: {params.mass}</span>
      </div>

      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        <line
          x1="0" y1={svgH} x2={svgW} y2="0"
          stroke="currentColor"
          className="text-black/5 dark:text-white/5"
          strokeDasharray="4 4"
        />
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          className="text-black/70 dark:text-white/70"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Live preview */}
      <div className="relative flex h-14 items-center overflow-hidden rounded-xl bg-black/[0.03] px-4 dark:bg-white/[0.03]">
        <A.div
          key={nonce}
          an={`enter:slide-right ${token} duration-${sim.durationMs}`}
          className="h-8 w-8 rounded-lg bg-gradient-to-br from-black to-black/80 shadow-md dark:from-white dark:to-white/80"
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <code className="truncate rounded-lg bg-black/5 px-3 py-2 font-mono text-xs text-black/70 dark:bg-white/10 dark:text-white/70">
            {token}
          </code>
          <CopyButton text={token} />
        </div>
        <button
          type="button"
          onClick={() => setNonce((n) => n + 1)}
          className="h-8 shrink-0 rounded-lg border border-black/10 bg-black/5 px-3 text-xs font-medium text-black/70 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
        >
          Replay
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Interactive Spring Playground                                             */
/* -------------------------------------------------------------------------- */

function SpringPlayground() {
  const [stiffness, setStiffness] = React.useState(170);
  const [damping, setDamping] = React.useState(26);
  const [mass, setMass] = React.useState(1);
  const [nonce, setNonce] = React.useState(0);

  const sim = React.useMemo(
    () => simulateSpring({ stiffness, damping, mass }),
    [stiffness, damping, mass]
  );

  const svgW = 200;
  const svgH = 150;
  const path = springSvgPath(sim.values, svgW, svgH);

  const token = `ease-spring(${stiffness},${damping},${mass})`;

  const sliderClass =
    "h-1 w-full cursor-pointer appearance-none rounded-full bg-black/10 accent-black/70 dark:bg-white/10 dark:accent-white/70 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black/70 dark:[&::-webkit-slider-thumb]:bg-white/70";

  return (
    <div className={`${CARD} p-6`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Left: curve + preview */}
        <div className="flex flex-1 flex-col gap-4">
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="w-full"
            preserveAspectRatio="none"
          >
            {/* Reference diagonal */}
            <line
              x1="0" y1={svgH} x2={svgW} y2="0"
              stroke="currentColor"
              className="text-black/5 dark:text-white/5"
              strokeDasharray="4 4"
            />
            {/* Overshoot reference line at y=1 */}
            <line
              x1="0" y1="0" x2={svgW} y2="0"
              stroke="currentColor"
              className="text-black/10 dark:text-white/10"
              strokeDasharray="2 4"
            />
            <path
              d={path}
              fill="none"
              stroke="currentColor"
              className="text-black/70 dark:text-white/70"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Live preview */}
          <div className="relative flex h-14 items-center overflow-hidden rounded-xl bg-black/[0.03] px-4 dark:bg-white/[0.03]">
            <A.div
              key={nonce}
              an={`enter:slide-right ease-spring(${stiffness},${damping},${mass}) duration-${sim.durationMs}`}
              className="h-8 w-8 rounded-lg bg-gradient-to-br from-black to-black/80 shadow-md dark:from-white dark:to-white/80"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1">
              <code className="truncate rounded-lg bg-black/5 px-3 py-2 font-mono text-xs text-black/70 dark:bg-white/10 dark:text-white/70">
                {token}
              </code>
              <CopyButton text={token} />
            </div>
            <button
              type="button"
              onClick={() => setNonce((n) => n + 1)}
              className="h-8 shrink-0 rounded-lg border border-black/10 bg-black/5 px-3 text-xs font-medium text-black/70 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
            >
              Replay
            </button>
          </div>
        </div>

        {/* Right: sliders */}
        <div className="flex w-full flex-col gap-4 lg:w-56">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-medium text-black/70 dark:text-white/70">
                stiffness
              </span>
              <span className="text-[11px] tabular-nums text-black/50 dark:text-white/50">
                {stiffness}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={1000}
              step={1}
              value={stiffness}
              onChange={(e) => setStiffness(Number(e.target.value))}
              className={sliderClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-medium text-black/70 dark:text-white/70">
                damping
              </span>
              <span className="text-[11px] tabular-nums text-black/50 dark:text-white/50">
                {damping}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={damping}
              onChange={(e) => setDamping(Number(e.target.value))}
              className={sliderClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-medium text-black/70 dark:text-white/70">
                mass
              </span>
              <span className="text-[11px] tabular-nums text-black/50 dark:text-white/50">
                {mass}
              </span>
            </div>
            <input
              type="range"
              min={0.1}
              max={10}
              step={0.1}
              value={mass}
              onChange={(e) => setMass(Number(e.target.value))}
              className={sliderClass}
            />
          </div>

          <div className="mt-2 text-[11px] text-black/40 dark:text-white/40">
            Duration: {sim.durationMs}ms ({sim.values.length} frames)
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function EasingsPage() {
  const cssEasingNames = Object.keys(CSS_EASINGS);
  const springPresetEntries = Object.entries(SPRING_PRESETS) as Array<
    [string, { stiffness: number; damping: number; mass: number }]
  >;

  return (
    <>
      <div className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
          Easings & Springs
        </h1>
        <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">
          Built-in easing curves and spring presets. Use easing tokens in the{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">
            an
          </code>{" "}
          prop to control animation timing.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  CSS Easings                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          CSS Easings
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Standard CSS timing functions. Click a curve to preview the animation.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cssEasingNames.map((name) => (
            <CSSEasingCard key={name} name={name} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Spring Presets                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="mt-12">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Spring Presets
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Physics-based spring curves generated from stiffness, damping, and mass
          parameters.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {springPresetEntries.map(([name, params]) => (
            <SpringPresetCard key={name} name={name} params={params} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Interactive Spring Playground                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="mt-12">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Spring Playground
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Drag the sliders to design a custom spring curve. Copy the generated
          token to use it in your animations.
        </p>
        <div className="mt-4">
          <SpringPlayground />
        </div>
      </section>
    </>
  );
}
