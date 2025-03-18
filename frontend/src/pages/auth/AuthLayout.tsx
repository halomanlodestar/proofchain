import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/hooks/use-auth.tsx";

const AuthLayout = () => {
  const { isAuthenticated, isLoading, isCheckingAuth } = useAuth();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const redirect = params.get("redirect") || "/";

  if (isLoading || isCheckingAuth) {
    return null;
  }

  return (
    <div
      className={
        "w-full h-page container-x container-y flex justify-center items-center [&>div]:w-full [&>div]:sm:w-1/2 [&>div]:lg:w-1/3"
      }
    >
      {isAuthenticated ? <Navigate to={redirect} replace /> : <Outlet />}
    </div>
  );
};

export default AuthLayout;
