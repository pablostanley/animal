"use client";

import { A } from "@vercel/animal/react";

export function FadeUpDemo() {
  return (
    <div className="mt-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">Live demo</p>
      <div className="mt-3 flex items-center justify-center rounded-xl border border-black/10 bg-black/[0.02] p-10 dark:border-white/10 dark:bg-white/[0.02]">
        <A.div
          an="enter:fade-up duration-400 ease-out"
          className="rounded-lg bg-black/10 px-6 py-4 text-sm font-medium text-black dark:bg-white/10 dark:text-white"
        >
          enter:fade-up
        </A.div>
      </div>
    </div>
  );
}
