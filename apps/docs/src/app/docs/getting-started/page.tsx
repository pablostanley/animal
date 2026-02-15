import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";

export default function GettingStartedPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
        Getting Started
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
        Get up and running with Animal in under a minute. Install the package, import the components,
        and start animating.
      </p>

      {/* Install */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Install
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          <CodeBlock lang="bash" code={`npm install @vercel/animal`} />
          <CodeBlock lang="bash" code={`pnpm add @vercel/animal`} />
          <CodeBlock lang="bash" code={`yarn add @vercel/animal`} />
        </div>
      </section>

      {/* Setup */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Setup
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Import <code className="rounded bg-white/10 px-1.5 py-0.5">A</code> from the React
          entry point. <code className="rounded bg-white/10 px-1.5 py-0.5">A</code> is a proxy
          that wraps any HTML element:{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">A.div</code>,{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">A.button</code>,{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">A.span</code>, etc.
        </p>
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`import { A } from "@vercel/animal/react";

export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <A.div an="enter:fade-up duration-240 ease-out">
      {children}
    </A.div>
  );
}`}
          />
        </div>
      </section>

      {/* First animation */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Your First Animation
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Combine <code className="rounded bg-white/10 px-1.5 py-0.5">A</code> with{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">Presence</code> to animate elements
          in and out. The <code className="rounded bg-white/10 px-1.5 py-0.5">an</code> prop
          accepts a space-separated list of tokens that describe the animation.
        </p>
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`import { A, Presence } from "@vercel/animal/react";
import { useState } from "react";

export function ToggleDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(!open)}>Toggle</button>
      <Presence present={open}>
        <A.div an="enter:fade-up exit:fade-down duration-240 ease-in-out">
          Hello, Animal!
        </A.div>
      </Presence>
    </div>
  );
}`}
          />
        </div>
      </section>

      {/* Token quick reference */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Token Quick Reference
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          The <code className="rounded bg-white/10 px-1.5 py-0.5">an</code> prop uses a small
          DSL. Here are the most common tokens:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Category</th>
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Example</th>
                <th className="pb-2 font-medium text-black/70 dark:text-white/70">Description</th>
              </tr>
            </thead>
            <tbody className="text-black/60 dark:text-white/60">
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4">Phase preset</td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">enter:fade-up</code></td>
                <td className="py-2">Animate on enter with fade + translate up</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4">Duration</td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">duration-240</code></td>
                <td className="py-2">Set duration to 240ms</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4">Delay</td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">delay-80</code></td>
                <td className="py-2">Delay animation start by 80ms</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4">Easing</td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">ease-in-out</code></td>
                <td className="py-2">CSS easing function</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4">Spring</td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">ease-spring-bouncy</code></td>
                <td className="py-2">Spring easing preset</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4">Transform</td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">y-12 scale-1.03</code></td>
                <td className="py-2">Override transform values</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Behavior</td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">in-view loop</code></td>
                <td className="py-2">Trigger on scroll, loop indefinitely</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Next steps */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Next Steps
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { href: "/docs/tokens", title: "Token DSL", desc: "Full token grammar reference" },
            { href: "/docs/components", title: "Components", desc: "A.*, Presence, and Stagger" },
            { href: "/docs/hooks", title: "Hooks", desc: "useInView, useScrollProgress, and more" },
            { href: "/docs/easings", title: "Easings & Springs", desc: "Easing functions and spring presets" },
            { href: "/docs/presets", title: "Presets", desc: "Browse all animation presets" },
            { href: "/docs/api", title: "API Reference", desc: "Complete API documentation" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-black/10 p-4 transition-colors hover:bg-black/[0.03] dark:border-white/10 dark:hover:bg-white/[0.03]"
            >
              <h3 className="text-sm font-medium text-black dark:text-white">{item.title}</h3>
              <p className="mt-1 text-xs text-black/50 dark:text-white/50">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
