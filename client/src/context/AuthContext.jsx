import { createContext, useContext, useEffect } from "react";
import { useCurrentUser } from "../hooks/queries/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../services/userService";
import { setLogoutHandler } from "../lib/logoutHandler.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data: user, isLoading } = useCurrentUser();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      //
    }
    queryClient.clear();

  };

  useEffect(() => {
    setLogoutHandler(logout);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        loading: isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);