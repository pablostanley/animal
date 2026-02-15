"use client";

import * as React from "react";
import { A, Presence } from "@vercel/animal/react";

export function PresenceDemo() {
  const [show, setShow] = React.useState(true);
  return (
    <div className="mt-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">Live demo</p>
      <div className="mt-3 rounded-xl border border-black/10 bg-black/[0.02] p-10 dark:border-white/10 dark:bg-white/[0.02]">
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="h-8 rounded-md border border-black/10 bg-black/5 px-3 text-xs font-medium text-black/70 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
          >
            {show ? "Hide" : "Show"}
          </button>
          <div className="flex h-16 items-center">
            <Presence present={show}>
              <A.div
                an="enter:fade-up exit:fade-down duration-240 ease-in-out"
                className="rounded-lg bg-black/10 px-6 py-4 text-sm font-medium text-black dark:bg-white/10 dark:text-white"
              >
                Presence + A.div
              </A.div>
            </Presence>
          </div>
        </div>
      </div>
    </div>
  );
}
