import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext";

function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default PublicRoute