import * as React from "react";

type PresenceContextValue = Readonly<{
  isPresent: boolean;
  safeToRemove: () => void;
}>;

const PresenceContext = React.createContext<PresenceContextValue | null>(null);

export function usePresence(): PresenceContextValue | null {
  return React.useContext(PresenceContext);
}

export type PresenceProps = {
  present: boolean;
  children: React.ReactNode;
  onExitComplete?: () => void;
};

// MVP: single-presence boundary (enough for modals, toasts, route wrappers).
export function Presence({ present, children, onExitComplete }: PresenceProps) {
  const [isMounted, setIsMounted] = React.useState(present);
  const [isPresent, setIsPresent] = React.useState(present);

  React.useEffect(() => {
    if (present) {
      setIsMounted(true);
      setIsPresent(true);
      return;
    }
    setIsPresent(false);
  }, [present]);

  const safeToRemove = React.useCallback(() => {
    // Only remove after we have transitioned from present -> not present.
    if (present) return;
    setIsMounted(false);
    onExitComplete?.();
  }, [onExitComplete, present]);

  if (!isMounted) return null;

  const value = React.useMemo(() => ({ isPresent, safeToRemove }), [isPresent, safeToRemove]);

  return (
    <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>
  );
}
