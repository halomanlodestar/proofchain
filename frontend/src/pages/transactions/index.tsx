import { useSearchParams } from "react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client.ts";
import { useAuth } from "@/hooks/use-auth.tsx";
import { TransactionStatus } from "@/types";
import TransactionsList from "@/components/TransactionsList.tsx";
import NewTransactionModal from "@/components/NewTransactionModal.tsx";

const Transactions = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  const { user } = useAuth();

  const status = (searchParams.get("status") ||
    "successful") as TransactionStatus;

  const { data: transactions } = useQuery({
    queryKey: ["transactions", status],
    queryFn: async () => {
      const res = await api.transaction.getIncluding(
        user!.id,
        status.toUpperCase() as TransactionStatus,
      );
      return res.data.transactions;
    },
  });

  return (
    <div className={"container-x container-y space-y-5"}>
      <div className={"flex justify-between items-center"}>
        <h1 className={"text-2xl md:text-3xl"}>Transactions</h1>

        <NewTransactionModal />
      </div>

      <Tabs defaultValue={status} className="w-full">
        <TabsList>
          <TabsTrigger
            onClick={() => setSearchParam({ status: "successful" })}
            value="successful"
            className={"w-1/2"}
          >
            Successful
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setSearchParam({ status: "pending" })}
            value="pending"
            className={"w-1/2"}
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setSearchParam({ status: "rejected" })}
            value="rejected"
            className={"w-1/2"}
          >
            Rejected
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <TransactionsList transactions={transactions} />
    </div>
  );
};

export default Transactions;
