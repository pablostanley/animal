import type * as React from "react";
import { createAnimalComponent } from "./factory";

export { Presence, usePresence } from "./Presence";
export { Stagger, useStagger } from "./Stagger";
export { useInView } from "./useInView";
export { useReducedMotion } from "./useReducedMotion";
export { useScrollProgress } from "./useScrollProgress";

export type { PresenceProps } from "./Presence";
export type { StaggerProps } from "./Stagger";
export type { InViewOptions } from "./useInView";
export type { ScrollProgressOptions } from "./useScrollProgress";
export type { AnimalElementProps } from "./factory";

type AnimalComponents = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof React.JSX.IntrinsicElements]: React.ForwardRefExoticComponent<any>;
};

const componentCache = new Map<string, unknown>();

export const A = new Proxy(
  {},
  {
    get(_target, tag: string | symbol) {
      if (typeof tag !== "string") return undefined;
      const key = String(tag);
      const cached = componentCache.get(key);
      if (cached) return cached;
      const component = createAnimalComponent(key as keyof React.JSX.IntrinsicElements);
      componentCache.set(key, component);
      return component;
    },
  }
) as AnimalComponents;
