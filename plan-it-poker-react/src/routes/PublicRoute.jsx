import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

export const PublicRoute = () => {
  const { token } = useAuth();

  // Dacă utilizatorul este autentificat, redirect către dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
