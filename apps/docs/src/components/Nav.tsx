import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/70">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold tracking-tight text-black dark:text-white">
            Animal
          </Link>
          <nav className="flex items-center gap-4 text-sm text-black/60 dark:text-white/70">
            <Link href="/docs" className="hover:text-black dark:hover:text-white">
              Docs
            </Link>
            <Link href="/playground" className="hover:text-black dark:hover:text-white">
              Playground
            </Link>
            <Link href="/docs/api" className="hover:text-black dark:hover:text-white">
              API
            </Link>
            <Link href="/docs/presets" className="hover:text-black dark:hover:text-white">
              Presets
            </Link>
            <Link href="/docs/manifest" className="hover:text-black dark:hover:text-white">
              Manifest
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
