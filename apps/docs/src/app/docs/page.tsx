import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";

const navCards = [
  { href: "/docs/getting-started", title: "Getting Started", description: "Install and add your first animation." },
  { href: "/docs/tokens", title: "Token DSL", description: "Full reference for the an prop grammar." },
  { href: "/docs/components", title: "Components", description: "A, Presence, and Stagger with live demos." },
  { href: "/docs/hooks", title: "Hooks", description: "useInView, useScrollProgress, useReducedMotion." },
  { href: "/docs/easings", title: "Easings", description: "Interactive playground for spring and CSS curves." },
  { href: "/docs/presets", title: "Presets", description: "Browse all animation presets with live preview." },
];

export default function DocsHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">Docs</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
        Animal is an opinionated preset library for UI micro-interactions and presence transitions in React and Next.js.
        Apply animations via a small, predictable token DSL on the <code className="rounded bg-white/10 px-1.5 py-0.5">an</code>{" "}
        prop.
      </p>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Quickstart (React)
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Use <code className="rounded bg-white/10 px-1.5 py-0.5">A</code> to animate DOM elements and{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">Presence</code> to keep elements mounted until exit finishes.
        </p>
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`import { A, Presence } from "@vercel/animal/react";

export function Example({ open }: { open: boolean }) {
  return (
    <Presence present={open}>
      <A.div an="enter:fade-up exit:fade-down duration-240 ease-in-out">
        Hello
      </A.div>
    </Presence>
  );
}`}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">Token DSL</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          The <code className="rounded bg-white/10 px-1.5 py-0.5">an</code> prop is a space-separated list of tokens.
          Presets are usually phase-scoped like <code className="rounded bg-white/10 px-1.5 py-0.5">hover:lift</code>.
        </p>
        <div className="mt-4">
          <CodeBlock
            lang="txt"
            code={`// phases
enter:fade-up exit:fade-down hover:lift press:compress focus:lift

// timing
duration-240 delay-80

// easing
ease-in-out ease-spring-default ease-spring-snappy ease-spring-bouncy

// transforms (px or unitless)
x-12 y--8 scale-1.03`}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Explore
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {navCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-black/10 bg-black/[0.03] p-4 hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
            >
              <p className="text-sm font-medium text-black/80 dark:text-white/80">{card.title}</p>
              <p className="mt-1 text-xs text-black/50 dark:text-white/50">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
