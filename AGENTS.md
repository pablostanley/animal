# Animal (AI-Agent Notes)

Animal is an opinionated animation preset library for React/Next.js micro-interactions and presence transitions.

## API Surface (MVP)

- `@vercel/animal/react`
  - `A.<tag>`: proxy that returns an animatable React component for any intrinsic element.
    - Use `an="..."` (token DSL) to apply presets and overrides.
  - `Presence`: keeps children mounted until exit animations finish.
- `@vercel/animal`
  - `ANIMAL_MANIFEST`: machine-readable catalog of presets + tokens.
  - `parseAnimalTokens()`: parses the `an` token string.

## Token DSL

The `an` prop is a space-separated list of tokens.

- Presets: `<phase>:<preset>` (or `<preset>` which implies `enter:`)
  - phases: `enter`, `exit`, `hover`, `press`, `focus`
- Timing: `duration-<ms>`, `delay-<ms>`
- Easing:
  - `ease-linear | ease | ease-in | ease-out | ease-in-out`
  - `ease-spring-default | ease-spring-snappy | ease-spring-bouncy | ease-spring-strong`
- Transforms: `x-<px>`, `y-<px>`, `scale-<ratio>`
- Reduced motion: `rm-system | rm-always | rm-never`

## Agent-Friendly Endpoints (Docs App)

- `/manifest.json`: JSON manifest for tools/agents.
- `/llms.txt`: text quick reference for LLMs.

## Development Commands

- `pnpm dev`: runs workspace dev scripts in parallel
- `pnpm build`: builds all packages/apps
- `pnpm lint`: lints apps (currently only `apps/docs`)
- `pnpm typecheck`: typechecks packages (currently only `packages/animal`)

