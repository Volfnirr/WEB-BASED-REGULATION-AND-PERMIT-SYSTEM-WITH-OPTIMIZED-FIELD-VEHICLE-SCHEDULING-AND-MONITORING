"use client";
import { createContext, useContext } from "react";
import { useUserInfo } from "@/lib/api/userinfo";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  // { user, role, isLoggedIn, isPending, error }
  const userInfo = useUserInfo();
  return (
    // to use add this <UserProvider> in the layout
    <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
  );
}

// error handling + destructuring
// to use
// const name {user, role, isLoggedIn, isPending, error} = useUser()
export function useUser() {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
