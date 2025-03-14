import { useAuth } from "@/hooks/use-auth.tsx";
import { Navigate } from "react-router";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={"/auth/signin"} />;
  }

  return (
    <div className={"container-x container-y"}>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;
