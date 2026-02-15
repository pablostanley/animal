import { CodeBlock } from "@/components/CodeBlock";

export default function TokensPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
        Token DSL
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
        The <code className="rounded bg-white/10 px-1.5 py-0.5">an</code> prop accepts a
        space-separated string of tokens. Tokens are parsed left to right and configure which
        preset to play, when, and how.
      </p>

      {/* Grammar */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Grammar
        </h2>
        <div className="mt-4">
          <CodeBlock
            lang="txt"
            code={`an="[phase:]preset [phase:]preset ...timing ...easing ...transform ...behavior"

Examples:
  an="enter:fade-up"
  an="enter:fade-up exit:fade-down duration-240 ease-in-out"
  an="hover:lift press:compress duration-180 ease-out"
  an="enter:scale scale-1.2 duration-800 ease-spring-bouncy in-view loop"`}
          />
        </div>
      </section>

      {/* Phases */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Phases
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Phases scope a preset to a specific interaction or lifecycle event. Prefix a preset with
          a phase and a colon.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Phase</th>
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Example</th>
                <th className="pb-2 font-medium text-black/70 dark:text-white/70">Triggers when</th>
              </tr>
            </thead>
            <tbody className="text-black/60 dark:text-white/60">
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">enter</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">enter:fade-up</code></td>
                <td className="py-2">Element mounts (or enters via Presence)</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">exit</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">exit:fade-down</code></td>
                <td className="py-2">Element unmounts (requires Presence wrapper)</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">hover</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">hover:lift</code></td>
                <td className="py-2">Pointer enters the element</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">press</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">press:compress</code></td>
                <td className="py-2">Pointer is pressed down on the element</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">focus</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">focus:lift</code></td>
                <td className="py-2">Element receives keyboard focus</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-6 text-black/60 dark:text-white/60">
          An unprefixed preset defaults to the <code className="rounded bg-white/10 px-1.5 py-0.5">enter</code> phase.
        </p>
      </section>

      {/* Timing */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Timing
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Control animation duration and delay. Values are in milliseconds.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Token</th>
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Example</th>
                <th className="pb-2 font-medium text-black/70 dark:text-white/70">Description</th>
              </tr>
            </thead>
            <tbody className="text-black/60 dark:text-white/60">
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">{"duration-{ms}"}</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">duration-240</code></td>
                <td className="py-2">Animation duration in milliseconds</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">{"delay-{ms}"}</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">delay-80</code></td>
                <td className="py-2">Delay before animation starts</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`<A.div an="enter:fade-up duration-300 delay-100">
  Fades up over 300ms after a 100ms delay
</A.div>`}
          />
        </div>
      </section>

      {/* Easing */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Easing
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Set easing curves. CSS easing keywords, spring presets, and custom cubic-bezier are supported.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Token</th>
                <th className="pb-2 font-medium text-black/70 dark:text-white/70">Resolves to</th>
              </tr>
            </thead>
            <tbody className="text-black/60 dark:text-white/60">
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">ease</code></td>
                <td className="py-2">CSS <code className="rounded bg-white/10 px-1.5 py-0.5">ease</code></td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">ease-linear</code></td>
                <td className="py-2">CSS <code className="rounded bg-white/10 px-1.5 py-0.5">linear</code></td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">ease-in</code></td>
                <td className="py-2">CSS <code className="rounded bg-white/10 px-1.5 py-0.5">ease-in</code></td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">ease-out</code></td>
                <td className="py-2">CSS <code className="rounded bg-white/10 px-1.5 py-0.5">ease-out</code></td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">ease-in-out</code></td>
                <td className="py-2">CSS <code className="rounded bg-white/10 px-1.5 py-0.5">ease-in-out</code></td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">ease-spring-default</code></td>
                <td className="py-2">Default spring easing</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">ease-spring-snappy</code></td>
                <td className="py-2">Snappy spring with minimal overshoot</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">ease-spring-bouncy</code></td>
                <td className="py-2">Bouncy spring with overshoot</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">ease-spring-strong</code></td>
                <td className="py-2">Strong spring with heavy overshoot</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">{"ease-cubic-{x1}-{y1}-{x2}-{y2}"}</code></td>
                <td className="py-2">Custom <code className="rounded bg-white/10 px-1.5 py-0.5">cubic-bezier(x1, y1, x2, y2)</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`<A.div an="enter:fade-up ease-spring-bouncy">
  Spring-based fade up
</A.div>

<A.div an="enter:fade-up ease-cubic-0.34-1.56-0.64-1">
  Custom cubic-bezier easing
</A.div>`}
          />
        </div>
      </section>

      {/* Transforms */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Transforms
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Override the default transform values of a preset. Negative values use a minus sign.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Token</th>
                <th className="pb-2 pr-4 font-medium text-black/70 dark:text-white/70">Example</th>
                <th className="pb-2 font-medium text-black/70 dark:text-white/70">Description</th>
              </tr>
            </thead>
            <tbody className="text-black/60 dark:text-white/60">
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">{"x-{px}"}</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">x-12</code></td>
                <td className="py-2">Horizontal translate in pixels</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">{"y-{px}"}</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">y--8</code></td>
                <td className="py-2">Vertical translate in pixels (negative = up)</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">{"scale-{ratio}"}</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">scale-1.05</code></td>
                <td className="py-2">Scale factor (1 = no change)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">{"rotate-{deg}"}</code></td>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">rotate-5</code></td>
                <td className="py-2">Rotation in degrees</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`<A.div an="enter:fade-up y-20 scale-0.95 duration-400">
  Custom fade up with larger translate and slight scale
</A.div>`}
          />
        </div>
      </section>

      {/* Behavior */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Behavior
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Control when and how animations trigger.
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
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">in-view</code></td>
                <td className="py-2">Defer enter animation until element scrolls into viewport (once)</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">in-view-repeat</code></td>
                <td className="py-2">Re-trigger enter animation every time element enters viewport</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">scroll-progress</code></td>
                <td className="py-2">Link animation progress to scroll position (0-100%)</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">loop</code></td>
                <td className="py-2">Repeat the enter animation indefinitely</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">{"loop-{n}"}</code></td>
                <td className="py-2">Repeat the enter animation n times</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`{/* Animate when scrolled into view */}
<A.div an="enter:fade-up in-view">Lazy fade in</A.div>

{/* Scroll-linked parallax */}
<A.div an="enter:fade-up scroll-progress y-40">Parallax</A.div>

{/* Loop 3 times */}
<A.div an="enter:scale scale-1.2 duration-800 loop-3">Pulse</A.div>`}
          />
        </div>
      </section>

      {/* Stagger */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Stagger
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          The <code className="rounded bg-white/10 px-1.5 py-0.5">{"stagger-{ms}"}</code> token sets the delay
          increment between children when used inside a{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">Stagger</code> component.
        </p>
        <div className="mt-4">
          <CodeBlock
            lang="tsx"
            code={`<A.div an="enter:fade-up stagger-80">
  Adds 80ms between each child animation
</A.div>`}
          />
        </div>
      </section>

      {/* Reduced Motion */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
          Reduced Motion
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
          Control how the animation responds to the user&apos;s reduced motion preference.
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
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">rm-system</code></td>
                <td className="py-2">Respect the OS-level <code className="rounded bg-white/10 px-1.5 py-0.5">prefers-reduced-motion</code> setting (default)</td>
              </tr>
              <tr className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">rm-always</code></td>
                <td className="py-2">Always reduce motion regardless of OS setting</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="rounded bg-white/10 px-1.5 py-0.5">rm-never</code></td>
                <td className="py-2">Never reduce motion (use with caution)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
