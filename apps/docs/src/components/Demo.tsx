"use client";

import * as React from "react";
import { A, Presence } from "@vercel/animal/react";

export function Demo() {
  const [open, setOpen] = React.useState(false);

  return (
    <section className="w-full rounded-2xl border border-black/10 bg-black/5 p-6 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-black/80 dark:text-white/80">Try it</p>
          <p className="text-sm text-black/60 dark:text-white/60">
            Hover, press, and toggle presence. Everything below is pure preset tokens.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="h-10 rounded-md border border-black/10 bg-black/5 px-4 text-sm text-black/70 hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:focus-visible:ring-white/30"
            onClick={() => setOpen((v) => !v)}
          >
            Toggle modal
          </button>
          <A.button
            an="hover:lift press:compress duration-180 ease-out"
            className="h-10 rounded-md bg-white px-4 text-sm font-medium text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:focus-visible:ring-white/30"
            type="button"
          >
            Button
          </A.button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <A.div
          an="enter:fade-up duration-420 ease-spring-default"
          className="aspect-square rounded-xl border border-black/10 bg-gradient-to-br from-black/10 to-black/5 dark:border-white/10 dark:from-white/10 dark:to-white/5"
        />
        <A.div
          an="enter:pop duration-420 ease-spring-snappy"
          className="aspect-square rounded-xl border border-black/10 bg-gradient-to-br from-black/10 to-black/5 dark:border-white/10 dark:from-white/10 dark:to-white/5"
        />
        <A.div
          an="enter:fade-right duration-420 ease-spring-default"
          className="aspect-square rounded-xl border border-black/10 bg-gradient-to-br from-black/10 to-black/5 dark:border-white/10 dark:from-white/10 dark:to-white/5"
        />
        <A.div
          an="enter:scale duration-420 ease-spring-bouncy"
          className="aspect-square rounded-xl border border-black/10 bg-gradient-to-br from-black/10 to-black/5 dark:border-white/10 dark:from-white/10 dark:to-white/5"
        />
      </div>

      <Presence present={open}>
        <A.div
          an="enter:fade-up exit:fade-down duration-240 ease-in-out"
          className="mt-6 rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-black dark:text-white">Presence</p>
              <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                This block stays mounted until the exit preset finishes.
              </p>
            </div>
            <button
              type="button"
              className="h-9 rounded-md border border-black/10 bg-black/5 px-3 text-sm text-black/70 hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:focus-visible:ring-white/30"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </A.div>
      </Presence>
    </section>
  );
}
