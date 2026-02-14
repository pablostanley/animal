"use client";

import * as React from "react";

export type CodeBlockProps = {
  code: string;
  lang?: string;
};

export function CodeBlock({ code, lang = "tsx" }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const normalized = React.useMemo(() => code.replace(/^\n+/, "").replace(/\n+$/, "\n"), [code]);

  const onCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(normalized);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
      return;
    } catch {
      // Fallback: best-effort copy via a temporary textarea.
      const el = document.createElement("textarea");
      el.value = normalized;
      el.style.position = "fixed";
      el.style.top = "0";
      el.style.left = "0";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      } catch {
        // ignore
      } finally {
        document.body.removeChild(el);
      }
    }
  }, [normalized]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-black">
      <div className="flex items-center justify-between gap-3 px-3 py-2">
        <span className="font-mono text-[11px] text-black/50 dark:text-white/50">{lang}</span>
        <button
          type="button"
          onClick={onCopy}
          className="h-7 rounded-md border border-black/10 bg-black/5 px-2 text-[11px] text-black/70 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
          aria-label="Copy code"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-auto px-4 pb-4 text-xs text-black/70 dark:text-white/70">
        <code>{normalized}</code>
      </pre>
    </div>
  );
}

