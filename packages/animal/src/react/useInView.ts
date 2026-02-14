import * as React from "react";

export type InViewOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

export function useInView(options: InViewOptions = {}): {
  ref: React.RefCallback<Element>;
  inView: boolean;
} {
  const { threshold = 0.1, rootMargin = "0px", once = true } = options;
  const [inView, setInView] = React.useState(false);
  const elementRef = React.useRef<Element | null>(null);
  const observerRef = React.useRef<IntersectionObserver | null>(null);
  const frozenRef = React.useRef(false);

  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (frozenRef.current) return;
        const visible = entry?.isIntersecting ?? false;
        setInView(visible);
        if (visible && once) {
          frozenRef.current = true;
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current = observer;
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  const ref = React.useCallback((node: Element | null) => {
    if (elementRef.current) observerRef.current?.unobserve(elementRef.current);
    elementRef.current = node;
    if (node) observerRef.current?.observe(node);
  }, []);

  return { ref, inView };
}
