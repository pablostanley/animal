"use client";

import * as React from "react";
import { A, Stagger } from "@vercel/animal/react";

export function StaggerDemo() {
  const [staggerKey, setStaggerKey] = React.useState(0);
  return (
    <div className="mt-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">Live demo</p>
      <div className="mt-3 rounded-xl border border-black/10 bg-black/[0.02] p-10 dark:border-white/10 dark:bg-white/[0.02]">
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => setStaggerKey((k) => k + 1)}
            className="h-8 rounded-md border border-black/10 bg-black/5 px-3 text-xs font-medium text-black/70 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
          >
            Replay
          </button>
          <Stagger key={staggerKey} stagger={80}>
            {["Item 1", "Item 2", "Item 3", "Item 4"].map((item) => (
              <A.div
                key={item}
                an="enter:fade-up duration-300 ease-out"
                className="rounded-lg bg-black/10 px-6 py-2 text-sm font-medium text-black dark:bg-white/10 dark:text-white"
              >
                {item}
              </A.div>
            ))}
          </Stagger>
        </div>
      </div>
    </div>
  );
}
