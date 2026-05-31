import { createContext, PropsWithChildren, useContext } from "react";

import { usePlansContext } from "@/contexts/PlansContext";
import { useProgress } from "@/hooks/useProgress";

type ProgressContextValue = ReturnType<typeof useProgress>;

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: PropsWithChildren) {
  const { plan } = usePlansContext();
  const progress = useProgress(plan);

  return <ProgressContext.Provider value={progress}>{children}</ProgressContext.Provider>;
}

export function useProgressContext() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error("useProgressContext must be used inside ProgressProvider");
  }

  return context;
}
