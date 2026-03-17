// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, logoutUser } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 run ONLY once on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data.user || data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = async () => {
    try {
      await logoutUser(); // backend clears cookie
    } catch {
      // ignore logout error
    }

    setUser(null);
    queryClient.clear();
  };
  console.log("USER:", user);
  console.log("AUTH:", !!user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);