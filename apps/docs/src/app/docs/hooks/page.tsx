import { CodeBlock } from "@/components/CodeBlock";

export default function HooksPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
        Hooks
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
        Animal provides three React hooks for manual control over viewport detection, scroll-driven
        effects, and reduced motion preferences.
      </p>

      {/* useInView */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          useInView
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Tracks whether an element is visible in the viewport using{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">IntersectionObserver</code>. For most
          cases, the <code className="rounded bg-white/10 px-1.5 py-0.5">in-view</code> token is
          simpler, but this hook gives manual control for conditional rendering or custom logic.
        </p>

        {/* Signature */}
        <div className="mt-4">
          <CodeBlock
            lang="ts"
            code={`const { ref, inView } = useInView(options?: InViewOptions)`}
          />
        </div>

        {/* Options table */}
        <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
          Options
        </h3>
        <div className="mt-3 overflow-x-auto">
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
                <td className="py-2">Visibility ratio (0-1) required to trigger.</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">rootMargin</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">string</code></td>
                <td className="py-2 pr-4">&quot;0px&quot;</td>
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

        {/* Return value */}
        <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
          Return value
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Property</th>
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Type</th>
                <th className="pb-2 font-medium text-black/70 dark:text-white/70">Description</th>
              </tr>
            </thead>
            <tbody className="text-black/60 dark:text-white/60">
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">ref</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">RefCallback&lt;Element&gt;</code></td>
                <td className="py-2">Attach to the target element.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">inView</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">boolean</code></td>
                <td className="py-2">Whether the element is currently in the viewport.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Example */}
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
      </section>

      {/* useScrollProgress */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          useScrollProgress
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Returns a 0-1 progress value based on an element&apos;s scroll position within the viewport.
          For most cases, the{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">scroll-progress</code> token is
          simpler, but this hook gives manual control for custom scroll-driven effects.
        </p>

        {/* Signature */}
        <div className="mt-4">
          <CodeBlock
            lang="ts"
            code={`const { ref, progress } = useScrollProgress(options?: ScrollProgressOptions)`}
          />
        </div>

        {/* Options table */}
        <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
          Options
        </h3>
        <div className="mt-3 overflow-x-auto">
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

        {/* Return value */}
        <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
          Return value
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Property</th>
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Type</th>
                <th className="pb-2 font-medium text-black/70 dark:text-white/70">Description</th>
              </tr>
            </thead>
            <tbody className="text-black/60 dark:text-white/60">
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">ref</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">RefCallback&lt;Element&gt;</code></td>
                <td className="py-2">Attach to the target element.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">progress</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">number</code></td>
                <td className="py-2">Scroll progress from 0 to 1.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Example */}
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
      </section>

      {/* useReducedMotion */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          useReducedMotion
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Returns a boolean indicating whether the user prefers reduced motion. The policy argument
          controls behavior: <code className="rounded bg-white/10 px-1.5 py-0.5">&quot;system&quot;</code>{" "}
          (default) respects the OS setting,{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">&quot;always&quot;</code> forces reduced
          motion, and <code className="rounded bg-white/10 px-1.5 py-0.5">&quot;never&quot;</code> ignores
          it.
        </p>

        {/* Signature */}
        <div className="mt-4">
          <CodeBlock
            lang="ts"
            code={`const prefersReduced = useReducedMotion(policy?: "system" | "always" | "never")`}
          />
        </div>

        {/* Parameters */}
        <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
          Parameters
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Parameter</th>
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Type</th>
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Default</th>
                <th className="pb-2 font-medium text-black/70 dark:text-white/70">Description</th>
              </tr>
            </thead>
            <tbody className="text-black/60 dark:text-white/60">
              <tr>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">policy</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">&quot;system&quot; | &quot;always&quot; | &quot;never&quot;</code></td>
                <td className="py-2 pr-4">&quot;system&quot;</td>
                <td className="py-2">How to handle the reduced motion preference.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Return value */}
        <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
          Return value
        </h3>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Returns <code className="rounded bg-white/10 px-1.5 py-0.5">boolean</code> &mdash;{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">true</code> when motion should be
          reduced.
        </p>

        {/* Example */}
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`import { useReducedMotion } from "@vercel/animal/react";

export function AnimatedWidget() {
  const prefersReduced = useReducedMotion("system");

  return (
    <div className={prefersReduced ? "no-animation" : "animate-bounce"}>
      {prefersReduced ? "Static content" : "Bouncing content"}
    </div>
  );
}`}
          />
        </div>
      </section>
    </div>
  );
}
