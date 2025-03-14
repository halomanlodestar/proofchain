import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/use-auth.tsx";

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <div
      className={
        "w-full h-page container-x container-y flex justify-center items-center [&>div]:w-full [&>div]:sm:w-1/2 [&>div]:lg:w-1/3"
      }
    >
      {isAuthenticated ? <Navigate to={"/"} replace /> : <Outlet />}
    </div>
  );
};

export default AuthLayout;
