import { useParams } from "react-router";
import NotFound from "@/pages/NotFound.tsx";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client.ts";

const TransactionPage = () => {
  const params = useParams();

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
    return <div>Loading...</div>;
  }

  if (!transaction) {
    return <NotFound />;
  }

  return (
    <div className={"container-y container-x"}>
      Transaction Page {transaction.amount}
    </div>
  );
};

export default TransactionPage;
