import { useAuth } from "@/hooks/use-auth.tsx";
import { Navigate, Outlet, useLocation } from "react-router";

const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { pathname } = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={`/auth/signin?redirect=${encodeURIComponent(pathname)}`} />
    );
  }

  return <Outlet />;
};

export default ProtectedRoutes;
