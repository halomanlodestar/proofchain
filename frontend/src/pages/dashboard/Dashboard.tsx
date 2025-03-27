import TotalPayment from "@/components/Dashboard/TotalPayment.tsx";

const Dashboard = () => {
  // api call

  return (
    <div className={"container-x container-y space-y-5"}>
      <h1 className={"text-3xl"}>Dashboard</h1>
      <div className={"flex flex-col space-x-2"}>
        <TotalPayment />
      </div>
    </div>
  );
};

export default Dashboard;
