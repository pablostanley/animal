import Link from "next/link";

export default function DocsHomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">Docs</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
        Animal is an opinionated preset library for UI micro-interactions and presence transitions in React and Next.js.
        Apply animations via a small, predictable token DSL on the <code className="rounded bg-white/10 px-1.5 py-0.5">an</code>{" "}
        prop.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/docs/presets"
          className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Presets
        </Link>
        <Link
          href="/docs/manifest"
          className="inline-flex h-10 items-center justify-center rounded-md border border-black/10 bg-black/5 px-4 text-sm font-medium text-black/70 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
        >
          Agent manifest
        </Link>
        <Link href="/manifest.json" className="text-sm text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
          /manifest.json
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Quickstart (React)
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Use <code className="rounded bg-white/10 px-1.5 py-0.5">A</code> to animate DOM elements and{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">Presence</code> to keep elements mounted until exit finishes.
        </p>
        <pre className="mt-4 overflow-auto rounded-2xl border border-black/10 bg-black/5 p-4 text-xs text-black/70 dark:border-white/10 dark:bg-black dark:text-white/70">
          {`import { A, Presence } from "@vercel/animal/react";

export function Example({ open }: { open: boolean }) {
  return (
    <Presence present={open}>
      <A.div an="enter:fade-up exit:fade-down duration-240 ease-in-out">
        Hello
      </A.div>
    </Presence>
  );
}`}
        </pre>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">Token DSL</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          The <code className="rounded bg-white/10 px-1.5 py-0.5">an</code> prop is a space-separated list of tokens.
          Presets are usually phase-scoped like <code className="rounded bg-white/10 px-1.5 py-0.5">hover:lift</code>.
        </p>
        <pre className="mt-4 overflow-auto rounded-2xl border border-black/10 bg-black/5 p-4 text-xs text-black/70 dark:border-white/10 dark:bg-black dark:text-white/70">
          {`// phases
enter:fade-up exit:fade-down hover:lift press:compress focus:lift

// timing
duration-240 delay-80

// easing
ease-in-out ease-spring-default ease-spring-snappy ease-spring-bouncy

// transforms (px or unitless)
x-12 y--8 scale-1.03`}
        </pre>
      </section>
    </div>
  );
}

