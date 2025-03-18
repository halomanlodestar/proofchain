import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client.ts";
import { useAuth } from "@/hooks/use-auth.tsx";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router";

const Transactions = () => {
  const { user } = useAuth();

  const { data: transactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await api.transaction.getFrom(user!.id);
      return res.data.transactions;
    },
  });

  console.log(transactions);

  return (
    <div className={"container-x container-y"}>
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
      {transactions?.length === 0 && <p>No transactions</p>}
      {transactions?.map((transaction: any) => (
        <div key={transaction.id}>
          <p>{transaction.amount}</p>
          <p>{transaction.recipientId}</p>
        </div>
      ))}
    </div>
  );
};

export default Transactions;
