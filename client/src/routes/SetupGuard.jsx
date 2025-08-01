import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function SetupGuard() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.monthlyIncome) {
    return <Navigate to="/app/firstlogin" replace />;
  }

  return <Outlet />;
}
