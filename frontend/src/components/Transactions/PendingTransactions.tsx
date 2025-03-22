import { useAuth } from "@/hooks/use-auth.tsx";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client.ts";

const PendingTransactions = () => {
  const { user } = useAuth();

  const { data: transactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await api.transaction.getFrom(user!.id);
      return res.data.transactions;
    },
  });

  console.log(transactions);

  return <div></div>;
};

export default PendingTransactions;
