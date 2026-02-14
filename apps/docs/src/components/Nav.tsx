import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/70">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="rounded-md text-sm font-semibold tracking-tight text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:text-white dark:focus-visible:ring-white/30"
          >
            Animal
          </Link>
          <nav className="flex items-center gap-4 text-sm text-black/60 dark:text-white/70">
            <Link
              href="/docs"
              className="rounded-md hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:hover:text-white dark:focus-visible:ring-white/30"
            >
              Docs
            </Link>
            <Link
              href="/playground"
              className="rounded-md hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:hover:text-white dark:focus-visible:ring-white/30"
            >
              Playground
            </Link>
            <Link
              href="/docs/api"
              className="rounded-md hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:hover:text-white dark:focus-visible:ring-white/30"
            >
              API
            </Link>
            <Link
              href="/docs/presets"
              className="rounded-md hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:hover:text-white dark:focus-visible:ring-white/30"
            >
              Presets
            </Link>
            <Link
              href="/docs/manifest"
              className="rounded-md hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:hover:text-white dark:focus-visible:ring-white/30"
            >
              Manifest
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
