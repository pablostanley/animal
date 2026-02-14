import { ANIMAL_MANIFEST } from "@vercel/animal";

function dedent(strings: TemplateStringsArray, ...values: unknown[]) {
  let out = strings.reduce((acc, s, i) => acc + s + (values[i] == null ? "" : String(values[i])), "");
  out = out.replace(/^\n/, "").replace(/\n\s+$/g, "\n");
  const lines = out.split("\n");
  const indent = lines
    .filter((l) => l.trim().length > 0)
    .reduce((min, l) => Math.min(min, l.match(/^ */)?.[0].length ?? 0), Number.POSITIVE_INFINITY);
  if (!Number.isFinite(indent) || indent === 0) return out;
  return lines.map((l) => l.slice(indent)).join("\n");
}

export function GET() {
  const body = dedent`
    # Animal (Vercel) - LLM Quick Reference

    Animal is an opinionated animation preset library for React/Next.js UI micro-interactions and presence transitions.

    ## Where to start

    - Docs: /docs
    - API: /docs/api
    - Presets: /docs/presets
    - Manifest viewer: /docs/manifest
    - Machine-readable manifest: /manifest.json

    ## React usage

    \`\`\`tsx
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
    \`\`\`

    ## Token DSL

    The \`an\` prop is a space-separated list of tokens:

    - Presets: \`<phase>:<preset>\` (or just \`<preset>\` which implies \`enter:\`)
      - phases: enter, exit, hover, press, focus
      - examples: \`enter:fade-up\`, \`hover:lift\`, \`press:compress\`
    - Timing:
      - \`duration-<ms>\` (e.g. \`duration-240\`)
      - \`delay-<ms>\` (e.g. \`delay-80\`)
	    - Easing:
	      - \`ease-linear\` | \`ease\` | \`ease-in\` | \`ease-out\` | \`ease-in-out\`
	      - \`ease-spring-default\` | \`ease-spring-snappy\` | \`ease-spring-bouncy\` | \`ease-spring-strong\`
	    - Transforms (tokens apply as overrides):
	      - \`x-<px>\`, \`y-<px>\`, \`scale-<ratio>\` (e.g. \`y--8\`, \`scale-1.03\`)
	    - Reduced motion:
	      - \`rm-system\` | \`rm-always\` | \`rm-never\`

    ## Manifest basics

    Manifest schema version: ${ANIMAL_MANIFEST.schemaVersion}
    Preset count: ${ANIMAL_MANIFEST.presets.length}
  `;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
