"use client";

import Link from "next/link";
import { ANIMAL_MANIFEST } from "@vercel/animal";
import { A, Stagger } from "@vercel/animal/react";
import {
  ArrowRight,
  Command,
  Cpu,
  FileText,
  Layers,
  Link as LinkIcon,
} from "@geist-ui/icons";
import { Demo } from "@/components/Demo";
import { CopyButton } from "@/components/CopyButton";

const features = [
  {
    title: "Single prop API",
    description:
      "Apply enter, exit, hover, and press behavior with one token string.",
    icon: Command,
  },
  {
    title: "Calibrated springs",
    description:
      "Use tuned spring easings or define custom physics where precision matters.",
    icon: Cpu,
  },
  {
    title: "Manifest-first",
    description:
      "The public manifest lets tooling and agents reason about available presets.",
    icon: FileText,
  },
];

const installCmd = "npm i @vercel/animal";

const quickStartCode = `import { A, Presence } from "@vercel/animal/react";

function Example({ open }) {
  return (
    <Presence present={open}>
      <A.div an="enter:fade-up exit:fade-down">
        Hello
      </A.div>
    </Presence>
  );
}`;

const buttonCode = `<A.button an="hover:lift press:compress">
  Click me
</A.button>`;

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-20 px-6 py-14 sm:px-10 sm:py-20">
        <section className="grid gap-12 border-b border-black/10 pb-16 dark:border-white/10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Stagger stagger={80}>
            <A.p
              an="enter:fade-up in-view"
              className="text-xs font-medium uppercase tracking-[0.18em] text-black/45 dark:text-white/45"
            >
              @vercel/animal
            </A.p>
            <A.h1
              an="enter:fade-up in-view"
              className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-tight text-black dark:text-white sm:text-6xl"
            >
              Motion reduced to essentials.
            </A.h1>
            <A.p
              an="enter:fade-up in-view"
              className="mt-6 max-w-2xl text-pretty text-base leading-7 text-black/65 dark:text-white/65 sm:text-lg"
            >
              Animal gives React and Next.js teams a direct, readable animation system: one prop, predictable tokens, and tuned springs.
            </A.p>
            <A.div
              an="enter:fade-up in-view"
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href="/docs/getting-started"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-black px-4 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-white dark:text-black dark:focus-visible:ring-white/30"
              >
                Get started
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
              <Link
                href="/docs/presets"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-black/10 px-4 text-sm font-medium text-black/70 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:border-white/10 dark:text-white/75 dark:hover:bg-white/5 dark:focus-visible:ring-white/30"
              >
                Browse {ANIMAL_MANIFEST.presets.length} presets
                <Layers size={14} aria-hidden="true" />
              </Link>
            </A.div>
          </Stagger>

          <A.aside
            an="enter:fade-up in-view"
            className="h-fit rounded-xl border border-black/10 p-6 dark:border-white/10"
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/45 dark:text-white/45">
              System
            </p>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-3 dark:border-white/10">
                <dt className="text-black/60 dark:text-white/60">API shape</dt>
                <dd className="font-mono text-black/75 dark:text-white/75">A.&lt;tag&gt;</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-3 dark:border-white/10">
                <dt className="text-black/60 dark:text-white/60">Token model</dt>
                <dd className="font-mono text-black/75 dark:text-white/75">an=&quot;...&quot;</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-black/60 dark:text-white/60">Presence support</dt>
                <dd className="text-black/75 dark:text-white/75">Built in</dd>
              </div>
            </dl>
          </A.aside>
        </section>

        <Stagger stagger={80}>
          <section className="space-y-8">
            <A.p
              an="enter:fade-up in-view"
              className="text-xs font-medium uppercase tracking-[0.16em] text-black/45 dark:text-white/45"
            >
              Principles
            </A.p>
            <div className="grid gap-px overflow-hidden rounded-xl border border-black/10 bg-black/10 dark:border-white/10 dark:bg-white/10 sm:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <A.div
                    key={feature.title}
                    an="enter:fade-up in-view"
                    className="bg-white p-6 dark:bg-black"
                  >
                    <Icon size={15} className="text-black/55 dark:text-white/55" aria-hidden="true" />
                    <p className="mt-5 text-sm font-medium text-black/85 dark:text-white/85">
                      {feature.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">
                      {feature.description}
                    </p>
                  </A.div>
                );
              })}
            </div>
          </section>
        </Stagger>

        <A.section an="enter:fade-up in-view" className="space-y-8 border-t border-black/10 pt-16 dark:border-white/10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/45 dark:text-white/45">
              Quick start
            </p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-black/60 dark:text-white/60">
              Install, apply tokens, and let Presence handle exit transitions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-xl border border-black/10 p-5 dark:border-white/10">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-black/45 dark:text-white/45">
                1. Install
              </p>
              <div className="flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate font-mono text-sm text-black/70 dark:text-white/70">
                  {installCmd}
                </code>
                <CopyButton text={installCmd} />
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-black/10 p-5 dark:border-white/10">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-black/45 dark:text-white/45">
                2. Animate
              </p>
              <div className="relative">
                <div className="absolute right-0 top-0">
                  <CopyButton text={buttonCode} />
                </div>
                <pre className="overflow-auto pr-8 text-sm leading-6 text-black/70 dark:text-white/70">
                  <code>{buttonCode}</code>
                </pre>
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-black/10 p-5 dark:border-white/10 sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-black/45 dark:text-white/45">
                3. Preserve exits
              </p>
              <div className="relative">
                <div className="absolute right-0 top-0">
                  <CopyButton text={quickStartCode} />
                </div>
                <pre className="overflow-auto pr-8 text-sm leading-6 text-black/70 dark:text-white/70">
                  <code>{quickStartCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </A.section>

        <A.section an="enter:fade-up in-view" className="space-y-6 border-t border-black/10 pt-16 dark:border-white/10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/45 dark:text-white/45">
              AI resources
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
              Feed your assistant the manifest and quick reference so token suggestions stay valid.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link
              href="/manifest.json"
              className="inline-flex h-10 items-center justify-between rounded-md border border-black/10 px-3 text-sm text-black/70 hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
            >
              <span className="font-mono text-xs">/manifest.json</span>
              <LinkIcon size={14} aria-hidden="true" />
            </Link>
            <Link
              href="/llms.txt"
              className="inline-flex h-10 items-center justify-between rounded-md border border-black/10 px-3 text-sm text-black/70 hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
            >
              <span className="font-mono text-xs">/llms.txt</span>
              <LinkIcon size={14} aria-hidden="true" />
            </Link>
            <Link
              href="/docs/manifest"
              className="inline-flex h-10 items-center justify-between rounded-md border border-black/10 px-3 text-sm text-black/70 hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
            >
              <span>Manifest docs</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </A.section>

        <A.div an="enter:fade-up in-view" className="border-t border-black/10 pt-16 dark:border-white/10">
          <Demo />
        </A.div>
      </div>
    </div>
  );
}
