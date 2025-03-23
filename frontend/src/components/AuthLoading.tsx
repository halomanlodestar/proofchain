import { Loader2 } from "lucide-react";

const AuthLoading = () => {
  return (
    <div className={"h-page w-full flex justify-center items-center"}>
      <div className={"flex space-x-2"}>
        <Loader2 className={"animate-spin"} />
        <p>Authenticating</p>
      </div>
    </div>
  );
};

export default AuthLoading;
