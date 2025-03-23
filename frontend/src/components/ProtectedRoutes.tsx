import { useAuth } from "@/hooks/use-auth.tsx";
import { Navigate, Outlet, useLocation } from "react-router";
import AuthLoading from "@/components/AuthLoading.tsx";

const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading, isCheckingAuth } = useAuth();
  const { pathname } = useLocation();

  if (isLoading || isCheckingAuth) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={`/auth/signin?redirect=${encodeURIComponent(pathname)}`} />
    );
  }

  return <Outlet />;
};

export default ProtectedRoutes;
