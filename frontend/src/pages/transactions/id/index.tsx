import { useParams } from "react-router";
import NotFound from "@/pages/NotFound.tsx";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useAuth } from "@/hooks/use-auth.tsx";
import { Button } from "@/components/ui/button.tsx";
import { AxiosError } from "axios";
import { toast } from "sonner";

const TransactionPage = () => {
  const params = useParams();
  const { user, token } = useAuth();
  const { id } = params;

  const {
    data: transaction,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["transaction", id],
    queryFn: async () => {
      const response = await api.transaction.getById(id!);
      return response.data.transaction;
    },
  });

  const acceptTransaction = async (id: string, token: string) => {
    try {
      const { status } = await api.transaction.accept(id, token);

      if (status === 204) {
        toast.success("Transaction accepted successfully");
        await refetch();
      }
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401) {
          toast.error("You are not authorized to perform this action");
        } else {
          toast.error("An error occurred. Please try again later");
        }
      }
    }
  };

  const rejectTransaction = async (id: string, token: string) => {
    try {
      const { status } = await api.transaction.reject(id, token);

      if (status === 204) {
        toast.success("Transaction accepted successfully");
        await refetch();
      }
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401) {
          toast.error("You are not authorized to perform this action");
        } else {
          toast.error("An error occurred. Please try again later");
        }
      }
    }
  };

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

  if (!transaction || !id) {
    return <NotFound />;
  }

  const isRecipient = transaction.recipient.id === user!.id;

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

      <div>
        <div className={"text-lg font-semibold"}>Status</div>
        <div
          className={`text-3xl ${
            transaction.status === "PENDING"
              ? "text-yellow-500"
              : transaction.status === "SUCCESSFUL"
                ? "text-green-500"
                : "text-red-500"
          }`}
        >
          {transaction.status}
        </div>
      </div>
      {isRecipient && transaction.status === "PENDING" && (
        <div className={"flex justify-between"}>
          <Button
            variant={"destructive"}
            onClick={() => rejectTransaction(id!, token!)}
          >
            Reject Transaction
          </Button>
          <Button onClick={() => acceptTransaction(id!, token!)}>
            Accept Transaction
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
