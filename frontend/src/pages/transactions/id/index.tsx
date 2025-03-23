import { useParams } from "react-router";
import NotFound from "@/pages/NotFound.tsx";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
// import { useAuth } from "@/hooks/use-auth.tsx";

const TransactionPage = () => {
  const params = useParams();
  // const { user } = useAuth();
  const { id } = params;

  const { data: transaction, isLoading } = useQuery({
    queryKey: ["transaction", id],
    queryFn: async () => {
      const response = await api.transaction.get(id!);
      console.log(response);
      return response.data.transaction;
    },
  });

  if (isLoading) {
    return (
      <div className={"container-x container-y h-page space-y-5"}>
        <Skeleton className={"w-full h-12 border"} />
        <hr />
        <Skeleton className={"w-full h-20 border"} />
        <Skeleton className={"w-full h-20 border"} />
      </div>
    );
  }

  if (!transaction) {
    return <NotFound />;
  }

  // const isRecipient = transaction.recipient.id === user!.id;

  return (
    <div className={"container-y container-x space-y-5"}>
      <h1 className={"text-2xl md:text-3xl"}>Transaction</h1>
      <hr />
      <div className={"text-xl md:text-xl flex justify-between"}>
        <div className={"w-1/2"}>
          <div className={"text-lg font-semibold"}>Recipient</div>
          <div className={"text-3xl"}>{transaction.recipient.name}</div>
        </div>
        <div className={"w-1/2"}>
          <div className={"text-lg font-semibold"}>Sender</div>
          <div className={"text-3xl"}>{transaction.sender.name}</div>
        </div>
      </div>
      <div>
        <div className={"text-lg font-semibold"}>Amount</div>
        <div className={"text-3xl"}>{transaction.amount}</div>
      </div>
    </div>
  );
};

export default TransactionPage;
