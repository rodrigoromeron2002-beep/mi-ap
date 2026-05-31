import { createContext, PropsWithChildren, useContext } from "react";

import { useUserProfile } from "@/hooks/useUserProfile";

type UserProfileContextValue = ReturnType<typeof useUserProfile>;

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: PropsWithChildren) {
  const userProfile = useUserProfile();

  return (
    <UserProfileContext.Provider value={userProfile}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfileContext() {
  const context = useContext(UserProfileContext);

  if (!context) {
    throw new Error("useUserProfileContext must be used inside UserProfileProvider");
  }

  return context;
}
