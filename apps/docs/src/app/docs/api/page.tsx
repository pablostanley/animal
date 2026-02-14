import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";

export default function ApiPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">API</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
        Animal’s MVP is intentionally small: preset tokens in an <code className="rounded bg-white/10 px-1.5 py-0.5">an</code>{" "}
        prop, plus a presence boundary for exit animations.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/docs/presets"
          className="inline-flex h-10 items-center justify-center rounded-md border border-black/10 bg-black/5 px-4 text-sm font-medium text-black/70 hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:focus-visible:ring-white/30"
        >
          Browse presets
        </Link>
        <Link
          href="/manifest.json"
          className="rounded-md text-sm text-black/50 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:text-white/50 dark:hover:text-white dark:focus-visible:ring-white/30"
        >
          Manifest JSON
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          A (Animatable Elements)
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          <code className="rounded bg-white/10 px-1.5 py-0.5">A</code> is a proxy:{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">A.div</code>,{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">A.button</code>, etc. It runs WAAPI animations based on the
          tokens in <code className="rounded bg-white/10 px-1.5 py-0.5">an</code>.
        </p>
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`import { A } from "@vercel/animal/react";

export function Button() {
  return (
    <A.button
      an="hover:lift press:compress duration-180 ease-out"
      className="h-10 rounded-md bg-white px-4 text-sm font-medium text-black"
      type="button"
    >
      Button
    </A.button>
  );
}`}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">Presence</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Wrap content with <code className="rounded bg-white/10 px-1.5 py-0.5">Presence</code> to let exit animations
          finish before unmount.
        </p>
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`import { A, Presence } from "@vercel/animal/react";

export function Modal({ open }: { open: boolean }) {
  return (
    <Presence present={open}>
      <A.div
        an="enter:fade-up exit:fade-down duration-240 ease-in-out"
        role="dialog"
        aria-modal="true"
      >
        Modal
      </A.div>
    </Presence>
  );
}`}
          />
        </div>
      </section>
    </div>
  );
}
