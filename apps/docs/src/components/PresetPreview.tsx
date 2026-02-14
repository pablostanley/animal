"use client";

import * as React from "react";
import { A, Presence } from "@vercel/animal/react";
import { CopyButton } from "./CopyButton";

type Props = {
  phase: string;
  name: string;
};

/** Amplify default params so animations are clearly visible in the small preview box. */
function amplifiedToken(phase: string, name: string): string {
  const base = `${phase}:${name}`;

  // Hover/press/focus — scope the param override to the phase
  if (phase === "hover") {
    if (name === "lift") return `${base} hover:y-10`;
    if (name === "grow") return `${base} hover:scale-1.15`;
    if (name === "shrink") return `${base} hover:scale-0.85`;
  }
  if (phase === "press") {
    if (name === "compress") return `${base} press:scale-0.85`;
    if (name === "push") return `${base} press:y-6`;
  }
  if (phase === "focus") {
    if (name === "lift") return `${base} focus:y-6`;
  }

  // Enter/exit position presets — exaggerate offset
  const yPresets = ["slide-up", "slide-down", "fade-up", "fade-down"];
  const xPresets = ["slide-left", "slide-right", "fade-left", "fade-right"];
  const scalePresets = ["pop", "scale", "elastic-scale", "zoom-out"];

  const extras: string[] = [];
  if (yPresets.includes(name)) extras.push("y-32");
  if (xPresets.includes(name)) extras.push("x-32");
  if (scalePresets.includes(name)) extras.push("scale-0.6");
  if (name === "bounce-in" || name === "drop-in") extras.push("y-40");

  return extras.length ? `${base} ${extras.join(" ")}` : base;
}

export function PresetPreview({ phase, name }: Props) {
  const [show, setShow] = React.useState(true);
  const [nonce, setNonce] = React.useState(0);
  const token = `${phase}:${name}`;

  const replay = React.useCallback(() => {
    if (phase === "enter" || phase === "exit") {
      setShow(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShow(true);
          setNonce((n) => n + 1);
        });
      });
    }
  }, [phase]);

  const isEnterExit = phase === "enter" || phase === "exit";
  const enterToken = phase === "enter" ? name : "fade";
  const exitToken = phase === "exit" ? name : "fade";

  const amplifiedEnter = amplifiedToken("enter", enterToken);
  const amplifiedExit = amplifiedToken("exit", exitToken);
  const enterExitAn = `${amplifiedEnter} ${amplifiedExit}`;
  const interactionAn = amplifiedToken(phase, name);

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
              an={enterExitAn}
              className="relative z-10 h-20 w-20 rounded-2xl bg-gradient-to-br from-black to-black/80 shadow-lg dark:from-white dark:to-white/80"
            />
          </Presence>
        ) : (
          <A.div
            an={interactionAn}
            className="relative z-10 h-20 w-20 cursor-pointer rounded-2xl bg-gradient-to-br from-black to-black/80 shadow-lg dark:from-white dark:to-white/80"
            tabIndex={phase === "focus" ? 0 : undefined}
          />
        )}
      </div>

      {/* Token display + actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <code className="truncate rounded-lg bg-black/5 px-3 py-2 font-mono text-xs text-black/70 dark:bg-white/10 dark:text-white/70">
            an=&quot;{token}&quot;
          </code>
          <CopyButton text={`an="${token}"`} />
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
