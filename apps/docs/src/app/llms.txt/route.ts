import { ANIMAL_MANIFEST } from "@vercel/animal";
import type { PresetManifestItem } from "@vercel/animal";

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

function formatPresetLine(p: PresetManifestItem): string {
  const paramEntries = Object.entries(p.params) as Array<
    [string, { default: number; unit: string }]
  >;
  const paramStr =
    paramEntries.length > 0
      ? ` [params: ${paramEntries.map(([k, v]) => `${k}=${v.default}${v.unit}`).join(", ")}]`
      : "";
  return `- ${p.phase}:${p.name} — ${p.description} (${p.defaults.durationMs}ms, ${p.defaults.easing})${paramStr}`;
}

function generatePresetCatalog(): string {
  const phases = ["enter", "exit", "hover", "press", "focus"] as const;
  const sections: string[] = [];

  for (const phase of phases) {
    const presets = ANIMAL_MANIFEST.presets.filter((p) => p.phase === phase);
    if (presets.length === 0) continue;
    const heading = phase.charAt(0).toUpperCase() + phase.slice(1);
    const lines = presets.map(formatPresetLine);
    sections.push(`### ${heading}\n${lines.join("\n")}`);
  }

  return sections.join("\n\n");
}

export function GET() {
  const presetCatalog = generatePresetCatalog();

  const body = dedent`
    # Animal (Vercel) - LLM Quick Reference

    Animal is an opinionated animation preset library for React/Next.js UI micro-interactions and presence transitions.

    ## Where to start

    - Docs: /docs
    - API: /docs/api
    - Presets: /docs/presets
    - Manifest viewer: /docs/manifest
    - Machine-readable manifest: /manifest.json
    - JSON Schema: /manifest.schema.json

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
      - \`x-<px>\`, \`y-<px>\`, \`scale-<ratio>\`, \`rotate-<deg>\` (e.g. \`y--8\`, \`scale-1.03\`, \`rotate-45\`)
    - Reduced motion:
      - \`rm-system\` | \`rm-always\` | \`rm-never\`

    ## Available presets

    ${presetCatalog}

    ## Common patterns

    ### Modal

    \`\`\`tsx
    <Presence present={open}>
      <A.div an="enter:fade exit:fade duration-200">
        <A.div an="enter:slide-up exit:slide-down duration-300 ease-spring-snappy">
          Modal content
        </A.div>
      </A.div>
    </Presence>
    \`\`\`

    ### Toast notification

    \`\`\`tsx
    <Presence present={visible}>
      <A.div an="enter:fade-up exit:fade duration-240 ease-out">
        {message}
      </A.div>
    </Presence>
    \`\`\`

    ### Interactive button

    \`\`\`tsx
    <A.button an="hover:lift press:compress">
      Click me
    </A.button>
    \`\`\`

    ### Card with hover effect

    \`\`\`tsx
    <A.div an="enter:fade-up hover:grow duration-300">
      Card content
    </A.div>
    \`\`\`

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
