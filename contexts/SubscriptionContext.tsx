import { createContext, PropsWithChildren, useContext } from "react";

import { useAuthContext } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";

type SubscriptionContextValue = ReturnType<typeof useSubscription>;

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: PropsWithChildren) {
  const auth = useAuthContext();
  const subscription = useSubscription(auth.session);

  return (
    <SubscriptionContext.Provider value={subscription}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionContext() {
  const context = useContext(SubscriptionContext);

  if (!context) {
    throw new Error("useSubscriptionContext must be used inside SubscriptionProvider");
  }

  return context;
}
