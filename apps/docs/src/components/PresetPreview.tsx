"use client";

import * as React from "react";
import { A, Presence } from "@vercel/animal/react";

type Props = {
  phase: string;
  name: string;
};

export function PresetPreview({ phase, name }: Props) {
  const [show, setShow] = React.useState(true);
  const [nonce, setNonce] = React.useState(0);
  const token = `${phase}:${name}`;

  const replay = React.useCallback(() => {
    if (phase === "enter" || phase === "exit") {
      setShow(false);
      // Brief delay so Presence can unmount, then re-mount
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShow(true);
          setNonce((n) => n + 1);
        });
      });
    }
  }, [phase]);

  const enterToken = phase === "enter" ? name : "fade";
  const exitToken = phase === "exit" ? name : "fade";
  const isEnterExit = phase === "enter" || phase === "exit";

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
              an={`enter:${enterToken} exit:${exitToken}`}
              className="relative z-10 h-20 w-20 rounded-2xl bg-gradient-to-br from-black to-black/80 shadow-lg dark:from-white dark:to-white/80"
            />
          </Presence>
        ) : (
          <A.div
            an={token}
            className="relative z-10 h-20 w-20 cursor-pointer rounded-2xl bg-gradient-to-br from-black to-black/80 shadow-lg dark:from-white dark:to-white/80"
            tabIndex={phase === "focus" ? 0 : undefined}
          />
        )}
      </div>

      {/* Token display */}
      <div className="flex items-center justify-between gap-3">
        <code className="rounded-lg bg-black/5 px-3 py-2 font-mono text-xs text-black/70 dark:bg-white/10 dark:text-white/70">
          an=&quot;{token}&quot;
        </code>
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
