import Link from "next/link";
import { ANIMAL_MANIFEST } from "@vercel/animal";
import { Demo } from "@/components/Demo";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[radial-gradient(70%_40%_at_50%_0%,rgba(0,0,0,0.10)_0%,rgba(255,255,255,0)_70%)] dark:bg-[radial-gradient(70%_40%_at_50%_0%,rgba(255,255,255,0.10)_0%,rgba(0,0,0,0)_70%)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12">
        <section className="flex flex-col gap-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/60 dark:text-white/60">
            Vercel open source proposal
          </p>
          <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-black dark:text-white sm:text-6xl">
            Animation presets that AI agents can apply reliably.
          </h1>
          <p className="max-w-2xl text-pretty text-base leading-7 text-black/70 dark:text-white/70 sm:text-lg">
            Opinionated micro-interactions and presence transitions for React and Next.js. Small API surface,
            predictable defaults, and a machine-readable manifest.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/docs"
              className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-white dark:text-black dark:focus-visible:ring-white/30"
            >
              Read docs
            </Link>
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
            <span className="text-sm text-black/50 dark:text-white/50">
              {ANIMAL_MANIFEST.presets.length} presets in manifest v{ANIMAL_MANIFEST.schemaVersion}
            </span>
          </div>
        </section>

        <Demo />
      </div>
    </div>
  );
}
