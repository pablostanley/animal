import * as React from "react";

type StaggerContextValue = Readonly<{
  claimIndex: () => number;
  staggerMs: number;
}>;

const StaggerContext = React.createContext<StaggerContextValue | null>(null);

export function useStagger(): StaggerContextValue | null {
  return React.useContext(StaggerContext);
}

export type StaggerProps = {
  stagger: number;
  children: React.ReactNode;
};

export function Stagger({ stagger, children }: StaggerProps) {
  const nextIndexRef = React.useRef(0);

  const claimIndex = React.useCallback(() => {
    return nextIndexRef.current++;
  }, []);

  const value = React.useMemo(
    () => ({ claimIndex, staggerMs: stagger }),
    [claimIndex, stagger]
  );

  return <StaggerContext.Provider value={value}>{children}</StaggerContext.Provider>;
}
