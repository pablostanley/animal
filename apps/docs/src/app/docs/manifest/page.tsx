import { ANIMAL_MANIFEST } from "@vercel/animal";

export default function ManifestPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">Agent Manifest</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60 dark:text-white/60">
        This is the machine-readable preset catalog. Fetch it at{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5">/manifest.json</code>.
      </p>

      <pre className="mt-6 overflow-auto rounded-2xl border border-black/10 bg-black/5 p-4 text-xs text-black/70 dark:border-white/10 dark:bg-black dark:text-white/70">
        {JSON.stringify(ANIMAL_MANIFEST, null, 2)}
      </pre>
    </div>
  );
}

