import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthWrapper";

function PrivateRoutes() {
  const token = useAuth();
  return token ? <Outlet /> : <Navigate to="/signin" />;
}

export default PrivateRoutes;
