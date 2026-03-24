import { createContext, useContext } from "react";
import { useCurrentUser } from "../hooks/queries/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data: user, isLoading } = useCurrentUser();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      await logoutUser(); // optional, backend cleanup
    } catch {
      //
    }

    queryClient.setQueryData(["me"], null);
    queryClient.invalidateQueries(["me"]); // ✅ THIS is real logout
  };

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