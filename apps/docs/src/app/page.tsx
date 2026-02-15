"use client";

import Link from "next/link";
import { ANIMAL_MANIFEST } from "@vercel/animal";
import { A, Stagger } from "@vercel/animal/react";
import { Demo } from "@/components/Demo";

const features = [
  {
    title: "One prop",
    description:
      "Add enter, exit, hover, and press animations with a single an prop. No keyframes, no state.",
  },
  {
    title: "Spring physics",
    description:
      "Four tuned spring presets or bring your own. Bouncy, snappy, or buttery smooth.",
  },
  {
    title: "AI-ready",
    description:
      "A machine-readable manifest lets agents pick and apply the right animation automatically.",
  },
];

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[radial-gradient(70%_40%_at_50%_0%,rgba(0,0,0,0.10)_0%,rgba(255,255,255,0)_70%)] dark:bg-[radial-gradient(70%_40%_at_50%_0%,rgba(255,255,255,0.10)_0%,rgba(0,0,0,0)_70%)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12">
        <section className="flex flex-col gap-5">
          <Stagger stagger={80}>
            <A.p
              an="enter:fade-up in-view"
              className="text-xs font-medium uppercase tracking-[0.18em] text-black/60 dark:text-white/60"
            >
              @vercel/animal
            </A.p>
            <A.h1
              an="enter:fade-up in-view"
              className="max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-black dark:text-white sm:text-6xl"
            >
              Add motion to React with a single prop.
            </A.h1>
            <A.p
              an="enter:fade-up in-view"
              className="max-w-2xl text-pretty text-base leading-7 text-black/70 dark:text-white/70 sm:text-lg"
            >
              Preset animations for enters, exits, hovers, and presses. One prop, zero config, spring physics built in.
            </A.p>
            <A.div
              an="enter:fade-up in-view"
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href="/docs/getting-started"
                className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-white dark:text-black dark:focus-visible:ring-white/30"
              >
                Get started
              </Link>
              <Link
                href="/docs/presets"
                className="inline-flex h-10 items-center justify-center rounded-md border border-black/10 bg-black/5 px-4 text-sm font-medium text-black/70 hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:focus-visible:ring-white/30"
              >
                Browse {ANIMAL_MANIFEST.presets.length} presets
              </Link>
            </A.div>
          </Stagger>
        </section>

        <Stagger stagger={80}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {features.map((feature) => (
              <A.div
                key={feature.title}
                an="enter:fade-up in-view"
                className="rounded-2xl border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <p className="text-sm font-medium text-black/80 dark:text-white/80">
                  {feature.title}
                </p>
                <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                  {feature.description}
                </p>
              </A.div>
            ))}
          </div>
        </Stagger>

        <A.div an="enter:fade-up in-view">
          <Demo />
        </A.div>
      </div>
    </div>
  );
}
