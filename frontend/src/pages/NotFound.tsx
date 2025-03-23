import { Ghost } from "lucide-react";

const NotFound = () => {
  return (
    <div className={"flex justify-center items-center h-page"}>
      <div className={"flex flex-col justify-center items-center space-y-5"}>
        <Ghost size={100} />
        <h1 className={"text-2xl"}>Transaction Not Found</h1>
      </div>
    </div>
  );
};

export default NotFound;
