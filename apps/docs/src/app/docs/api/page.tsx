import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";

export default function ApiPage() {
  return (
    <div>
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

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">Stagger</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Wrap sibling <code className="rounded bg-white/10 px-1.5 py-0.5">A.*</code> elements in{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">Stagger</code> to automatically apply incremental delays
          to each child's enter animation.
        </p>
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`import { A, Stagger } from "@vercel/animal/react";

export function List({ items }: { items: { id: string; name: string }[] }) {
  return (
    <Stagger stagger={80}>
      {items.map(item => (
        <A.div key={item.id} an="enter:fade-up">
          {item.name}
        </A.div>
      ))}
    </Stagger>
  );
}`}
          />
        </div>
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
                <td className="py-2">Delay in ms between each child's animation start.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">children</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">ReactNode</code></td>
                <td className="py-2">Child elements (typically A.* components).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">useInView</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          A hook that tracks whether an element is visible in the viewport using{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">IntersectionObserver</code>. For most cases, the{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">in-view</code> token on the{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">an</code> prop is simpler, but this hook gives manual control.
        </p>
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`import { useInView } from "@vercel/animal/react";

export function LazySection() {
  const { ref, inView } = useInView({ once: true, threshold: 0.1 });
  return (
    <div ref={ref}>
      {inView ? <ExpensiveContent /> : <Placeholder />}
    </div>
  );
}`}
          />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Option</th>
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Type</th>
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Default</th>
                <th className="pb-2 font-medium text-black/70 dark:text-white/70">Description</th>
              </tr>
            </thead>
            <tbody className="text-black/60 dark:text-white/60">
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">threshold</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">number</code></td>
                <td className="py-2 pr-4">0.1</td>
                <td className="py-2">Visibility ratio (0-1) to trigger.</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">rootMargin</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">string</code></td>
                <td className="py-2 pr-4">"0px"</td>
                <td className="py-2">Margin around the root (viewport).</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">once</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">boolean</code></td>
                <td className="py-2 pr-4">true</td>
                <td className="py-2">Stop observing after first intersection.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">in-view Token</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Add <code className="rounded bg-white/10 px-1.5 py-0.5">in-view</code> to the{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">an</code> prop to defer enter animations until the element
          scrolls into the viewport. Use <code className="rounded bg-white/10 px-1.5 py-0.5">in-view-repeat</code> to
          re-trigger every time.
        </p>
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`<A.div an="enter:fade-up in-view">
  Animates when scrolled into view
</A.div>

<A.div an="enter:fade-up in-view-repeat">
  Re-animates every time it enters the viewport
</A.div>`}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">Loop</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Add <code className="rounded bg-white/10 px-1.5 py-0.5">loop</code> to repeat an enter animation infinitely,
          or <code className="rounded bg-white/10 px-1.5 py-0.5">loop-&lt;count&gt;</code> for a specific number of
          iterations (e.g. <code className="rounded bg-white/10 px-1.5 py-0.5">loop-3</code>). Loop has no effect on
          exit animations.
        </p>
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`<A.div an="enter:scale scale-1.2 duration-800 ease-in-out loop">
  Pulses infinitely
</A.div>

<A.div an="enter:fade-up loop-3">
  Repeats 3 times then stops
</A.div>`}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Keyframe Presets
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Multi-step keyframe presets for richer enter and exit animations:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Token</th>
                <th className="pb-2 font-medium text-black/70 dark:text-white/70">Description</th>
              </tr>
            </thead>
            <tbody className="text-black/60 dark:text-white/60">
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">enter:bounce-in</code></td>
                <td className="py-2">Bounce in with elastic overshoot (600ms, linear timing).</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">enter:elastic-scale</code></td>
                <td className="py-2">Scale in with elastic bounce (600ms, linear timing).</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">enter:drop-in</code></td>
                <td className="py-2">Drop in from above with bounce (600ms, linear timing).</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">exit:zoom-out</code></td>
                <td className="py-2">Scale up and fade out (240ms, ease-in-out).</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`<A.div an="enter:bounce-in">
  Bouncy entrance
</A.div>`}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          scroll-progress Token
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Add <code className="rounded bg-white/10 px-1.5 py-0.5">scroll-progress</code> to link animation progress
          to the element's scroll position. The animation plays from 0% to 100% as the element traverses the viewport.
          Mutually exclusive with <code className="rounded bg-white/10 px-1.5 py-0.5">in-view</code>.
        </p>
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`<A.div an="enter:fade-up scroll-progress y-40">
  Parallax content that animates as you scroll
</A.div>`}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          useScrollProgress
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          A hook that returns a 0-1 progress value based on an element's scroll position within the viewport.
          For most cases, the <code className="rounded bg-white/10 px-1.5 py-0.5">scroll-progress</code> token is
          simpler, but this hook gives manual control for custom scroll-driven effects.
        </p>
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`import { useScrollProgress } from "@vercel/animal/react";

export function ParallaxSection() {
  const { ref, progress } = useScrollProgress({ start: 0, end: 1 });
  return (
    <div ref={ref} style={{ opacity: progress }}>
      Custom scroll-driven animation
    </div>
  );
}`}
          />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Option</th>
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Type</th>
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Default</th>
                <th className="pb-2 font-medium text-black/70 dark:text-white/70">Description</th>
              </tr>
            </thead>
            <tbody className="text-black/60 dark:text-white/60">
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">start</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">number</code></td>
                <td className="py-2 pr-4">0</td>
                <td className="py-2">Viewport fraction where tracking starts (0 = element enters bottom).</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">end</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">number</code></td>
                <td className="py-2 pr-4">1</td>
                <td className="py-2">Viewport fraction where tracking ends (1 = element exits top).</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">clamp</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">boolean</code></td>
                <td className="py-2 pr-4">true</td>
                <td className="py-2">Clamp progress to [0, 1].</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
