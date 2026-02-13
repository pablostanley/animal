import * as React from "react";
import type { AnimalOptions } from "../types";

export function useReducedMotion(policy: AnimalOptions["reducedMotion"] | undefined): boolean {
  const [prefersReduced, setPrefersReduced] = React.useState(false);

  React.useEffect(() => {
    if (policy === "always") {
      setPrefersReduced(true);
      return;
    }
    if (policy === "never") {
      setPrefersReduced(false);
      return;
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(mq.matches);
    update();

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }

    // Safari < 14
    // eslint-disable-next-line deprecation/deprecation
    mq.addListener(update);
    // eslint-disable-next-line deprecation/deprecation
    return () => mq.removeListener(update);
  }, [policy]);

  return prefersReduced;
}
