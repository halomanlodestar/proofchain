import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div
      className={
        "w-full h-page container-x container-y flex justify-center items-center [&>div]:w-full [&>div]:sm:w-1/2 [&>div]:lg:w-1/3"
      }
    >
      <Outlet />
    </div>
  );
};

export default AuthLayout;
