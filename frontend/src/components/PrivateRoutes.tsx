import { useAuth } from "@/hooks/use-auth.tsx";
import { Navigate, Outlet } from "react-router";

const PrivateRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={"/auth/login"} />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
