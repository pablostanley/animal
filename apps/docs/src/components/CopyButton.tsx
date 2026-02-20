"use client";

import * as React from "react";
import { Check, Copy } from "@geist-ui/icons";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const el = document.createElement("textarea");
          el.value = text;
          el.style.cssText = "position:fixed;opacity:0";
          document.body.appendChild(el);
          el.select();
          document.execCommand("copy");
          document.body.removeChild(el);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-black/35 transition-colors hover:text-black/55 dark:text-white/35 dark:hover:text-white/55"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check size={14} aria-hidden="true" />
      ) : (
        <Copy size={14} aria-hidden="true" />
      )}
    </button>
  );
}
