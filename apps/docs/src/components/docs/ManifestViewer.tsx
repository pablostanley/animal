import { ANIMAL_MANIFEST } from "@vercel/animal";

export function ManifestViewer() {
  return (
    <pre className="mt-6 overflow-auto rounded-2xl border border-black/10 bg-black/5 p-4 text-xs text-black/70 dark:border-white/10 dark:bg-black dark:text-white/70">
      {JSON.stringify(ANIMAL_MANIFEST, null, 2)}
    </pre>
  );
}
