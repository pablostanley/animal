"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  {
    title: "Getting Started",
    links: [
      { href: "/docs", label: "Introduction" },
      { href: "/docs/getting-started", label: "Quick Start" },
    ],
  },
  {
    title: "Core Concepts",
    links: [
      { href: "/docs/tokens", label: "Token DSL" },
      { href: "/docs/easings", label: "Easings & Springs" },
    ],
  },
  {
    title: "Components",
    links: [
      { href: "/docs/components", label: "A.*, Presence, Stagger" },
    ],
  },
  {
    title: "Hooks",
    links: [
      { href: "/docs/hooks", label: "useInView, useScrollProgress, useReducedMotion" },
    ],
  },
  {
    title: "Reference",
    links: [
      { href: "/docs/api", label: "API Reference" },
      { href: "/docs/presets", label: "Presets" },
      { href: "/docs/manifest", label: "Manifest" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <nav aria-label="Docs sidebar" className="sticky top-18 py-10 pr-4">
        <ul className="flex flex-col gap-6">
          {sections.map((section) => (
            <li key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-black/40 dark:text-white/40">
                {section.title}
              </h3>
              <ul className="mt-2 flex flex-col gap-0.5">
                {section.links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`block rounded-md px-2 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:focus-visible:ring-white/30 ${
                          isActive
                            ? "font-medium text-black dark:text-white"
                            : "text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
