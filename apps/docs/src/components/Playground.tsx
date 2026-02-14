"use client";

import * as React from "react";
import { A } from "@vercel/animal/react";
import { CodeBlock } from "./CodeBlock";

type EaseOption = Readonly<{ label: string; token: string; group: "css" | "spring" }>;

const EASES: readonly EaseOption[] = [
  { group: "css", label: "ease", token: "ease" },
  { group: "css", label: "linear", token: "ease-linear" },
  { group: "css", label: "in", token: "ease-in" },
  { group: "css", label: "out", token: "ease-out" },
  { group: "css", label: "in-out", token: "ease-in-out" },
  { group: "spring", label: "spring default", token: "ease-spring-default" },
  { group: "spring", label: "spring snappy", token: "ease-spring-snappy" },
  { group: "spring", label: "spring bouncy", token: "ease-spring-bouncy" },
  { group: "spring", label: "spring strong", token: "ease-spring-strong" },
] as const;

function clampInt(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function Playground() {
  const [easeToken, setEaseToken] = React.useState<string>("ease-spring-default");
  const [duration, setDuration] = React.useState<number>(900);
  const [distance, setDistance] = React.useState<number>(320);
  const [maxDistance, setMaxDistance] = React.useState<number>(320);
  const [atRight, setAtRight] = React.useState<boolean>(false);
  const [nonce, setNonce] = React.useState<number>(0);

  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const distanceTouchedRef = React.useRef(false);

  React.useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const update = () => {
      const cs = window.getComputedStyle(el);
      const paddingLeft = Number.parseFloat(cs.paddingLeft || "0") || 0;
      const paddingRight = Number.parseFloat(cs.paddingRight || "0") || 0;

      // Square is `w-10 h-10` (40px). Keep it explicit to avoid layout reads in render.
      const squareSize = 40;
      const innerWidth = Math.max(0, el.clientWidth - paddingLeft - paddingRight);
      const nextMax = Math.max(0, Math.floor(innerWidth - squareSize));

      setMaxDistance(nextMax);
      setDistance((current) => {
        if (!distanceTouchedRef.current) return nextMax;
        return Math.min(current, nextMax);
      });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const preset = React.useMemo(() => {
    // Avoid an initial right->left animation on first paint.
    if (nonce === 0) return "slide-right";
    return atRight ? "slide-right" : "slide-left";
  }, [atRight, nonce]);

  const baseX = atRight ? distance : 0;
  const durationUsed = nonce === 0 ? 0 : duration;

  const an = React.useMemo(
    () => `enter:${preset} x-${distance} duration-${durationUsed} ${easeToken}`,
    [distance, durationUsed, easeToken, preset]
  );

  const code = React.useMemo(
    () => `import { A } from "@vercel/animal/react";

export function Example() {
  return (
    <A.div an="${an}" />
  );
}`,
    [an]
  );

  const cssEases = React.useMemo(() => EASES.filter((e) => e.group === "css"), []);
  const springEases = React.useMemo(() => EASES.filter((e) => e.group === "spring"), []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">Playground</h1>
        <p className="max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Pick an easing, tweak parameters, and copy an{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">an</code> string. This replays an{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">enter:slide-*</code> preset.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">Easing</p>

          <div className="mt-3 overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
            <div className="border-b border-black/10 bg-black/5 px-3 py-2 text-[11px] text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
              CSS
            </div>
            <div className="flex flex-col">
              {cssEases.map((opt) => {
                const selected = easeToken === opt.token;
                return (
                  <button
                    key={opt.token}
                    type="button"
                    onClick={() => setEaseToken(opt.token)}
                    aria-pressed={selected}
                    className={[
                      "flex items-center justify-between gap-3 border-t border-black/10 px-3 py-2 text-left text-sm dark:border-white/10",
                      selected
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-transparent text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/5",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:focus-visible:ring-white/30",
                    ].join(" ")}
                  >
                    <span className="truncate">{opt.label}</span>
                    <span className={["font-mono text-[11px]", selected ? "text-white/70 dark:text-black/60" : "text-black/40 dark:text-white/40"].join(" ")}>
                      {opt.token}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
            <div className="border-b border-black/10 bg-black/5 px-3 py-2 text-[11px] text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
              Spring
            </div>
            <div className="flex flex-col">
              {springEases.map((opt) => {
                const selected = easeToken === opt.token;
                return (
                  <button
                    key={opt.token}
                    type="button"
                    onClick={() => setEaseToken(opt.token)}
                    aria-pressed={selected}
                    className={[
                      "flex items-center justify-between gap-3 border-t border-black/10 px-3 py-2 text-left text-sm dark:border-white/10",
                      selected
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-transparent text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/5",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:focus-visible:ring-white/30",
                    ].join(" ")}
                  >
                    <span className="truncate">{opt.label}</span>
                    <span className={["font-mono text-[11px]", selected ? "text-white/70 dark:text-black/60" : "text-black/40 dark:text-white/40"].join(" ")}>
                      {opt.token}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="lg:col-span-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">Preview</p>
            <button
              type="button"
              onClick={() => {
                setAtRight((v) => !v);
                setNonce((n) => n + 1);
              }}
              className="h-9 rounded-md border border-black/10 bg-black/5 px-3 text-sm text-black/70 hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:focus-visible:ring-white/30"
            >
              Replay
            </button>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-black/10 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(0,0,0,0.10)_0%,rgba(255,255,255,0)_70%)] p-6 dark:border-white/10 dark:bg-[radial-gradient(50%_50%_at_50%_0%,rgba(255,255,255,0.10)_0%,rgba(0,0,0,0)_70%)]">
            <div
              ref={trackRef}
              className="relative flex h-48 items-center overflow-hidden rounded-xl border border-black/10 bg-black/5 p-6 dark:border-white/10 dark:bg-white/5"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)",
                  backgroundSize: "18px 18px",
                }}
              />

              <div className="pointer-events-none absolute left-6 right-6 top-1/2 h-px bg-black/10 dark:bg-white/10" />

              <A.div
                // Key forces a re-mount so the enter phase runs again.
                key={`${easeToken}-${duration}-${distance}-${preset}-${atRight}-${nonce}`}
                an={an}
                className="h-10 w-10 rounded-xl bg-black dark:bg-white"
                style={{ transform: `translate(${baseX}px, 0px) rotate(0deg) scale(1)` }}
                aria-label="Preview square"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
                  Duration ({duration}ms)
                </span>
                <input
                  type="range"
                  min={120}
                  max={1800}
                  step={10}
                  value={duration}
                  onChange={(e) => setDuration(clampInt(Number(e.target.value), 120, 1800))}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
                  Distance ({distance}px / {maxDistance}px)
                </span>
                <input
                  type="range"
                  min={24}
                  max={Math.max(24, maxDistance)}
                  step={4}
                  value={distance}
                  onChange={(e) => {
                    distanceTouchedRef.current = true;
                    setDistance(clampInt(Number(e.target.value), 24, Math.max(24, maxDistance)));
                  }}
                />
              </label>
            </div>
          </div>
        </section>

        <section className="lg:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">Export</p>
          <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">
            Token string:
            <span className="mt-2 block rounded-xl border border-black/10 bg-black/5 p-3 font-mono text-xs text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
              {an}
            </span>
          </p>
          <div className="mt-4">
            <CodeBlock lang="tsx" code={code} />
          </div>
        </section>
      </div>
    </div>
  );
}
