import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { user, loading } = useAuth();

  // ⛔ wait until auth is resolved
  if (loading) {
    return null
  }

  // ⛔ not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ allowed
  return <Outlet />;
}

export default ProtectedRoute;