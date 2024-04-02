import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthWrapper";

function PublicRoutes() {
  const token = useAuth();

  if (token === null) {
    return null; // or loading indicator if needed
  }

  return token ? <Navigate to="/contact" replace /> : <Outlet />;
}

export default PublicRoutes;
