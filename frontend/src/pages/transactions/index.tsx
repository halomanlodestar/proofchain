import { Button } from "@/components/ui/button.tsx";
import { Link, useSearchParams } from "react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { PlusCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client.ts";
import { useAuth } from "@/hooks/use-auth.tsx";
import { TransactionStatus } from "@/types";
import TransactionsList from "@/components/TransactionsList.tsx";

const Transactions = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  const { user } = useAuth();

  const tab = (searchParams.get("tab") || "confirmed") as TransactionStatus;

  const { data: transactions } = useQuery({
    queryKey: ["transactions", tab],
    queryFn: async () => {
      const res = await api.transaction.getFrom(user!.id, tab);
      return res.data.transactions;
    },
  });

  return (
    <div className={"container-x container-y space-y-5"}>
      <div className={"flex justify-between items-center"}>
        <h1 className={"text-2xl md:text-3xl"}>Transactions</h1>
        <>
          <Button className={"md:hidden"} asChild>
            <Link to={"new"}>
              <PlusCircle />
            </Link>
          </Button>
          <Button variant={"outline"} className={"hidden md:flex"} asChild>
            <Link to={"new"}>
              <PlusCircle />
              Create Transaction
            </Link>
          </Button>
        </>
      </div>

      <Tabs defaultValue={tab} className="w-full">
        <TabsList>
          <TabsTrigger
            onClick={() => setSearchParam({ tab: "confirmed" })}
            value="confirmed"
            className={"w-1/2"}
          >
            Confirmed
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setSearchParam({ tab: "pending" })}
            value="pending"
            className={"w-1/2"}
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setSearchParam({ tab: "rejected" })}
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
