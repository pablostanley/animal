"use client";

import * as React from "react";
import { A, Presence } from "@vercel/animal/react";
import { CopyButton } from "./CopyButton";

type ParamMeta = { default: number; unit: string; description: string };

type Props = {
  phase: string;
  name: string;
  params?: Record<string, ParamMeta>;
};

function sliderConfig(key: string): { min: number; max: number; step: number } {
  if (key === "scale") return { min: 0.1, max: 2.0, step: 0.05 };
  if (key === "rotate") return { min: 0, max: 360, step: 1 };
  // x, y, and anything else: pixel-based
  return { min: 0, max: 100, step: 1 };
}

function formatValue(val: number, unit: string): string {
  if (unit === "ratio") return String(val);
  return `${val}${unit}`;
}

export function PresetPreview({ phase, name, params }: Props) {
  const [show, setShow] = React.useState(true);
  const [nonce, setNonce] = React.useState(0);

  // Slider state — initialised from param defaults
  const [sliderValues, setSliderValues] = React.useState<Record<string, number>>(() => {
    if (!params) return {};
    const init: Record<string, number> = {};
    for (const [k, v] of Object.entries(params)) {
      init[k] = v.default;
    }
    return init;
  });

  // Reset slider values when params change (new preset selected)
  React.useEffect(() => {
    if (!params) {
      setSliderValues({});
      return;
    }
    const init: Record<string, number> = {};
    for (const [k, v] of Object.entries(params)) {
      init[k] = v.default;
    }
    setSliderValues(init);
  }, [params]);

  const isEnterExit = phase === "enter" || phase === "exit";

  const replay = React.useCallback(() => {
    if (isEnterExit) {
      setShow(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShow(true);
          setNonce((n) => n + 1);
        });
      });
    }
  }, [isEnterExit]);

  // Build the an="" token from slider values
  const baseToken = `${phase}:${name}`;
  const paramEntries = Object.entries(sliderValues);
  const paramTokens = paramEntries
    .map(([key, val]) => `${key}-${val}`)
    .join(" ");

  // For enter/exit, we need to scope param overrides
  const enterToken = phase === "enter" ? name : "fade";
  const exitToken = phase === "exit" ? name : "fade";

  let anValue: string;
  if (isEnterExit) {
    const enterBase = `enter:${enterToken}`;
    const exitBase = `exit:${exitToken}`;
    if (paramTokens) {
      // Scope param overrides to the active phase
      anValue = phase === "enter"
        ? `${enterBase} ${paramTokens} ${exitBase}`
        : `${enterBase} ${exitBase} ${paramTokens}`;
    } else {
      anValue = `${enterBase} ${exitBase}`;
    }
  } else {
    // Interaction presets: scope params to the phase
    if (paramTokens) {
      const scopedParams = paramEntries
        .map(([key, val]) => `${phase}:${key}-${val}`)
        .join(" ");
      anValue = `${baseToken} ${scopedParams}`;
    } else {
      anValue = baseToken;
    }
  }

  // The display token shows only the relevant preset + params
  const displayToken = paramTokens ? `${baseToken} ${paramTokens}` : baseToken;

  // Debounced replay on slider change for enter/exit
  const sliderNonceRef = React.useRef(0);
  const handleSliderChange = React.useCallback(
    (key: string, val: number) => {
      setSliderValues((prev) => ({ ...prev, [key]: val }));
      if (isEnterExit) {
        sliderNonceRef.current += 1;
        const captured = sliderNonceRef.current;
        setTimeout(() => {
          if (sliderNonceRef.current === captured) {
            setShow(false);
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setShow(true);
                setNonce((n) => n + 1);
              });
            });
          }
        }, 200);
      }
    },
    [isEnterExit]
  );

  const hasParams = params && Object.keys(params).length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Preview area */}
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.03]">
        {/* Dot grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(128,128,128,0.25) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />

        {isEnterExit ? (
          <Presence present={show} key={nonce}>
            <A.div
              an={anValue}
              className="relative z-10 h-20 w-20 rounded-2xl bg-gradient-to-br from-black to-black/80 shadow-lg dark:from-white dark:to-white/80"
            />
          </Presence>
        ) : (
          <A.div
            an={anValue}
            className="relative z-10 h-20 w-20 cursor-pointer rounded-2xl bg-gradient-to-br from-black to-black/80 shadow-lg dark:from-white dark:to-white/80"
            tabIndex={phase === "focus" ? 0 : undefined}
          />
        )}
      </div>

      {/* Parameter sliders */}
      {hasParams && (
        <div className="mt-3 flex flex-col gap-3">
          {Object.entries(params).map(([key, meta]) => {
            const config = sliderConfig(key);
            const val = sliderValues[key] ?? meta.default;
            return (
              <div key={key} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] font-medium text-black/70 dark:text-white/70">
                    {key}
                  </span>
                  <span className="text-[11px] tabular-nums text-black/50 dark:text-white/50">
                    {formatValue(val, meta.unit)}
                  </span>
                </div>
                <input
                  type="range"
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  value={val}
                  onChange={(e) => handleSliderChange(key, Number(e.target.value))}
                  className="h-1 w-full cursor-pointer appearance-none rounded-full bg-black/10 accent-black/70 dark:bg-white/10 dark:accent-white/70 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black/70 dark:[&::-webkit-slider-thumb]:bg-white/70"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Token display + actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <code className="truncate rounded-lg bg-black/5 px-3 py-2 font-mono text-xs text-black/70 dark:bg-white/10 dark:text-white/70">
            an=&quot;{displayToken}&quot;
          </code>
          <CopyButton text={`an="${displayToken}"`} />
        </div>
        {isEnterExit && (
          <button
            type="button"
            onClick={replay}
            className="h-8 shrink-0 rounded-lg border border-black/10 bg-black/5 px-3 text-xs font-medium text-black/70 hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
          >
            Replay
          </button>
        )}
      </div>

      {/* Interaction hint for hover/press/focus */}
      {!isEnterExit && (
        <p className="text-center text-xs text-black/40 dark:text-white/40">
          {phase === "hover" && "Hover the square above"}
          {phase === "press" && "Click and hold the square above"}
          {phase === "focus" && "Tab to focus the square above"}
        </p>
      )}
    </div>
  );
}
