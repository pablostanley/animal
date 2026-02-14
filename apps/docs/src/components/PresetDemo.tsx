"use client";

import * as React from "react";
import { A, Presence } from "@vercel/animal/react";

export function PresetDemo({ phase, name }: { phase: string; name: string }) {
  const [show, setShow] = React.useState(true);

  if (phase === "enter" || phase === "exit") {
    const enterToken = phase === "enter" ? name : "fade";
    const exitToken = phase === "exit" ? name : "fade";
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="shrink-0 rounded border border-black/10 px-1.5 py-0.5 text-[10px] text-black/60 hover:bg-black/5 dark:border-white/10 dark:text-white/50 dark:hover:bg-white/5"
        >
          {show ? "Exit" : "Enter"}
        </button>
        <Presence present={show}>
          <A.div
            an={`enter:${enterToken} exit:${exitToken}`}
            className="h-7 w-7 rounded-md bg-gradient-to-br from-black/20 to-black/10 dark:from-white/20 dark:to-white/10"
          />
        </Presence>
      </div>
    );
  }

  // hover / press / focus: just render with the interaction token
  return (
    <A.div
      an={`${phase}:${name}`}
      className="h-7 w-7 cursor-pointer rounded-md bg-gradient-to-br from-black/20 to-black/10 dark:from-white/20 dark:to-white/10"
      tabIndex={phase === "focus" ? 0 : undefined}
    />
  );
}
