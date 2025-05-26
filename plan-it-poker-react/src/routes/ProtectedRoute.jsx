import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

export const ProtectedRoute = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      {/* Aici poți adăuga un layout comun pentru rutele protejate */}
      <Outlet />
    </div>
  );
};
