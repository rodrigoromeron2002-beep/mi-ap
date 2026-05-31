import { createContext, PropsWithChildren, useContext } from "react";

import { usePlans } from "@/hooks/usePlans";

type PlansContextValue = ReturnType<typeof usePlans>;

const PlansContext = createContext<PlansContextValue | null>(null);

export function PlansProvider({ children }: PropsWithChildren) {
  const plans = usePlans();

  return <PlansContext.Provider value={plans}>{children}</PlansContext.Provider>;
}

export function usePlansContext() {
  const context = useContext(PlansContext);

  if (!context) {
    throw new Error("usePlansContext must be used inside PlansProvider");
  }

  return context;
}
