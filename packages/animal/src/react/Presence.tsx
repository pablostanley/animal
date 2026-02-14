import * as React from "react";

type PresenceRegistration = Readonly<{
  safeToRemove: () => void;
  unregister: () => void;
}>;

type PresenceContextValue = Readonly<{
  isPresent: boolean;
  register: () => PresenceRegistration;
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
  const presentRef = React.useRef(present);
  presentRef.current = present;

  const aliveRef = React.useRef(true);
  React.useEffect(() => {
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const registeredRef = React.useRef(new Set<number>());
  const doneRef = React.useRef(new Set<number>());
  const nextIdRef = React.useRef(1);
  const exitIdRef = React.useRef(0);
  const didCompleteExitRef = React.useRef(false);

  const [isMounted, setIsMounted] = React.useState(present);
  const [isPresent, setIsPresent] = React.useState(present);

  const completeExit = React.useCallback(() => {
    if (didCompleteExitRef.current) return;
    didCompleteExitRef.current = true;
    if (!aliveRef.current) return;
    setIsMounted(false);
    onExitComplete?.();
  }, [onExitComplete]);

  const tryFinalizeExit = React.useCallback(() => {
    if (presentRef.current) return;
    if (didCompleteExitRef.current) return;

    const registered = registeredRef.current;
    // Backwards compatible: if no Animal children have registered, do not auto-unmount.
    if (registered.size === 0) return;

    const done = doneRef.current;
    if (done.size < registered.size) return;
    for (const id of registered) {
      if (!done.has(id)) return;
    }

    completeExit();
  }, [completeExit]);

  React.useEffect(() => {
    if (present) {
      didCompleteExitRef.current = false;
      doneRef.current.clear();
      setIsMounted(true);
      setIsPresent(true);
      return;
    }

    // Starting a new exit cycle: clear completions and bump the generation.
    didCompleteExitRef.current = false;
    exitIdRef.current += 1;
    doneRef.current.clear();
    setIsPresent(false);
    tryFinalizeExit();
  }, [present, tryFinalizeExit]);

  const register = React.useCallback((): PresenceRegistration => {
    const id = nextIdRef.current++;
    registeredRef.current.add(id);

    let lastCompletedExitId = 0;

    const safeToRemove = () => {
      if (presentRef.current) return;
      const exitId = exitIdRef.current;
      if (lastCompletedExitId === exitId) return;
      lastCompletedExitId = exitId;
      doneRef.current.add(id);
      tryFinalizeExit();
    };

    const unregister = () => {
      registeredRef.current.delete(id);
      doneRef.current.delete(id);
      tryFinalizeExit();
    };

    return { safeToRemove, unregister };
  }, [tryFinalizeExit]);

  if (!isMounted) return null;

  const value = React.useMemo(() => ({ isPresent, register }), [isPresent, register]);

  return (
    <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>
  );
}
