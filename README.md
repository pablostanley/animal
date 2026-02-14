# Animal

Animation presets for React and Next.js, designed to be reliable for both humans and AI agents.

- North star: micro-interactions + presence transitions (the Vercel/Next sweet spot)
- Design: opinionated presets, small API surface, predictable defaults
- Agent-first: machine-readable manifest + token DSL that’s easy to generate and validate

## Repo Layout

- `/packages/animal` - `@vercel/animal` (core + React entry)
- `/apps/docs` - Next.js docs site + interactive demos
  - Agent manifest endpoint: `/manifest.json`

## React Usage

```tsx
import { A, Presence } from "@vercel/animal/react";

export function Example({ open }: { open: boolean }) {
  return (
    <Presence present={open}>
      <A.div an="enter:fade-up exit:fade-down duration-240 ease-in-out">
        Hello
      </A.div>
    </Presence>
  );
}
```

## Token DSL (Quick Ref)

The `an` prop is a space-separated list of tokens:

- Presets: `<phase>:<preset>` (or just `<preset>` which implies `enter:`)
  - phases: `enter`, `exit`, `hover`, `press`, `focus`
- Timing: `duration-<ms>`, `delay-<ms>`
- Easing: `ease-linear | ease | ease-in | ease-out | ease-in-out | ease-spring-*`
- Transforms: `x-<px>`, `y-<px>`, `scale-<ratio>`
- Reduced motion: `rm-system | rm-always | rm-never`

## Agent Manifest

- In-code: `import { ANIMAL_MANIFEST } from "@vercel/animal";`
- Hosted (docs app): `/manifest.json`
- LLM quick reference (docs app): `/llms.txt`

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```
