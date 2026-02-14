import * as React from "react";

export type ScrollProgressOptions = {
  /** Viewport fraction where tracking starts (0 = element enters bottom). Default 0. */
  start?: number;
  /** Viewport fraction where tracking ends (1 = element exits top). Default 1. */
  end?: number;
  /** Clamp progress to [0, 1]. Default true. */
  clamp?: boolean;
};

export function useScrollProgress(options: ScrollProgressOptions = {}): {
  ref: React.RefCallback<Element>;
  progress: number;
} {
  const { start = 0, end = 1, clamp = true } = options;
  const [progress, setProgress] = React.useState(0);
  const elementRef = React.useRef<Element | null>(null);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      const el = elementRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // When element's top hits viewport bottom → raw = 0
      // When element's bottom exits viewport top → raw = 1
      const totalTravel = vh + rect.height;
      const traveled = vh - rect.top;
      let raw = traveled / totalTravel;

      // Map to start/end range
      const range = end - start;
      if (range > 0) {
        raw = (raw - start) / range;
      }

      if (clamp) raw = Math.max(0, Math.min(1, raw));

      setProgress(raw);
    };

    const onScroll = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update(); // initial

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [start, end, clamp]);

  const ref = React.useCallback((node: Element | null) => {
    elementRef.current = node;
  }, []);

  return { ref, progress };
}
