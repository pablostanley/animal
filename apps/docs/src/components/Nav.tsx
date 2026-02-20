"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github } from "@geist-ui/icons";
import { ThemeToggle } from "./ThemeToggle";
import type { ReactNode } from "react";

const navLinks = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/presets", label: "Presets" },
  { href: "/playground", label: "Playground" },
];

export function Nav({ leading }: { leading?: ReactNode }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          {leading}
          <Link
            href="/"
            className="rounded-md text-sm font-semibold tracking-tight text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:text-white dark:focus-visible:ring-white/30"
          >
            Animal
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-4 text-sm">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/docs"
                  ? pathname.startsWith("/docs") && pathname !== "/docs/presets"
                  : link.href === "/docs/presets"
                    ? pathname === "/docs/presets"
                    : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:focus-visible:ring-white/30 ${
                    isActive
                      ? "text-black dark:text-white"
                      : "text-black/60 hover:text-black dark:text-white/70 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/pablostanley/animal"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md text-black/60 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:text-white/60 dark:hover:text-white dark:focus-visible:ring-white/30"
            aria-label="GitHub repository"
          >
            <Github size={16} aria-hidden="true" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
