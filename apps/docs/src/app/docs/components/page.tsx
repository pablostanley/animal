"use client";

import * as React from "react";
import { A, Presence, Stagger } from "@vercel/animal/react";
import { CodeBlock } from "@/components/CodeBlock";

export default function ComponentsPage() {
  const [showPresence, setShowPresence] = React.useState(true);
  const [staggerKey, setStaggerKey] = React.useState(0);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
        Components
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
        Animal exports three React components:{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5">A</code>,{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5">Presence</code>, and{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5">Stagger</code>.
      </p>

      {/* A.* */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          A.* (Animatable Elements)
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          <code className="rounded bg-white/10 px-1.5 py-0.5">A</code> is a Proxy object. Access
          any HTML tag as a property (<code className="rounded bg-white/10 px-1.5 py-0.5">A.div</code>,{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">A.button</code>,{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">A.span</code>,{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">A.li</code>, etc.) to get an
          animated version of that element. The only extra prop is{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">an</code>, which accepts the
          token string.
        </p>

        {/* Props table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Prop</th>
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Type</th>
                <th className="pb-2 font-medium text-black/70 dark:text-white/70">Description</th>
              </tr>
            </thead>
            <tbody className="text-black/60 dark:text-white/60">
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">an</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">string</code></td>
                <td className="py-2">Space-separated token string defining the animation.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">...rest</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">HTMLAttributes</code></td>
                <td className="py-2">All standard HTML attributes for the underlying element.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`import { A } from "@vercel/animal/react";

<A.div an="enter:fade-up duration-240 ease-out">
  Animated div
</A.div>

<A.button an="hover:lift press:compress" type="button">
  Animated button
</A.button>

<A.span an="enter:scale ease-spring-bouncy">
  Animated span
</A.span>`}
          />
        </div>

        {/* Live demo */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
            Live demo
          </p>
          <div className="mt-3 flex items-center justify-center rounded-xl border border-black/10 bg-black/[0.02] p-10 dark:border-white/10 dark:bg-white/[0.02]">
            <A.div
              an="enter:fade-up duration-400 ease-out"
              className="rounded-lg bg-black/10 px-6 py-4 text-sm font-medium text-black dark:bg-white/10 dark:text-white"
            >
              enter:fade-up
            </A.div>
          </div>
        </div>
      </section>

      {/* Presence */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Presence
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          <code className="rounded bg-white/10 px-1.5 py-0.5">Presence</code> keeps children
          mounted in the DOM until exit animations finish. Set{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">present</code> to{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">false</code> to trigger the exit
          phase, then unmounts after the animation completes.
        </p>

        {/* Props table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Prop</th>
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Type</th>
                <th className="pb-2 font-medium text-black/70 dark:text-white/70">Description</th>
              </tr>
            </thead>
            <tbody className="text-black/60 dark:text-white/60">
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">present</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">boolean</code></td>
                <td className="py-2">Whether the children should be visible. When false, exit animations play before unmount.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">children</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">ReactNode</code></td>
                <td className="py-2">Child elements (typically A.* components with exit tokens).</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`import { A, Presence } from "@vercel/animal/react";

export function Modal({ open }: { open: boolean }) {
  return (
    <Presence present={open}>
      <A.div an="enter:fade-up exit:fade-down duration-240 ease-in-out">
        Modal content
      </A.div>
    </Presence>
  );
}`}
          />
        </div>

        {/* Live demo */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
            Live demo
          </p>
          <div className="mt-3 rounded-xl border border-black/10 bg-black/[0.02] p-10 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={() => setShowPresence((s) => !s)}
                className="h-8 rounded-md border border-black/10 bg-black/5 px-3 text-xs font-medium text-black/70 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
              >
                {showPresence ? "Hide" : "Show"}
              </button>
              <div className="flex h-16 items-center">
                <Presence present={showPresence}>
                  <A.div
                    an="enter:fade-up exit:fade-down duration-240 ease-in-out"
                    className="rounded-lg bg-black/10 px-6 py-4 text-sm font-medium text-black dark:bg-white/10 dark:text-white"
                  >
                    Presence + A.div
                  </A.div>
                </Presence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stagger */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Stagger
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Wrap sibling <code className="rounded bg-white/10 px-1.5 py-0.5">A.*</code> elements in{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">Stagger</code> to automatically add
          incremental delays to each child&apos;s enter animation.
        </p>

        {/* Props table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Prop</th>
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Type</th>
                <th className="pb-2 font-medium text-black/70 dark:text-white/70">Description</th>
              </tr>
            </thead>
            <tbody className="text-black/60 dark:text-white/60">
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">stagger</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">number</code></td>
                <td className="py-2">Delay in ms between each child&apos;s animation start.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">children</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">ReactNode</code></td>
                <td className="py-2">Child elements (typically A.* components).</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`import { A, Stagger } from "@vercel/animal/react";

export function List({ items }: { items: string[] }) {
  return (
    <Stagger stagger={80}>
      {items.map((item, i) => (
        <A.div key={i} an="enter:fade-up">
          {item}
        </A.div>
      ))}
    </Stagger>
  );
}`}
          />
        </div>

        {/* Live demo */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
            Live demo
          </p>
          <div className="mt-3 rounded-xl border border-black/10 bg-black/[0.02] p-10 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={() => setStaggerKey((k) => k + 1)}
                className="h-8 rounded-md border border-black/10 bg-black/5 px-3 text-xs font-medium text-black/70 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
              >
                Replay
              </button>
              <Stagger key={staggerKey} stagger={80}>
                {["Item 1", "Item 2", "Item 3", "Item 4"].map((item) => (
                  <A.div
                    key={item}
                    an="enter:fade-up duration-300 ease-out"
                    className="rounded-lg bg-black/10 px-6 py-2 text-sm font-medium text-black dark:bg-white/10 dark:text-white"
                  >
                    {item}
                  </A.div>
                ))}
              </Stagger>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
