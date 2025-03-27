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
  const { user } = useAuth();
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

  const acceptTransaction = async (id: string) => {
    try {
      const { status } = await api.transaction.accept(id);

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

  const rejectTransaction = async (id: string) => {
    try {
      const { status } = await api.transaction.reject(id);

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
  const prefix = isRecipient ? "from" : "to";
  const otherName = isRecipient
    ? transaction.sender.name
    : transaction.recipient.name;
  const statusColor =
    transaction.status === "PENDING"
      ? "bg-yellow-200"
      : transaction.status === "SUCCESSFUL"
        ? "bg-green-200"
        : "bg-red-200";
  const statusIcon = transaction.status === "PENDING" ? "⏳" : "✅";

  console.log(transaction);

  return (
    <div className={"container-y container-x space-y-5 pt-5"}>
      <div className={`w-full flex flex-col space-y-2 p-4 rounded-md`}>
        <h2>Money Transferred</h2>
        <strong className={"text-3xl"}>&#8377;{transaction.amount}</strong>
      </div>
      <div className={`${statusColor} p-4 rounded-md flex space-x-2`}>
        <strong className={"flex space-x-2"}>
          <span>{statusIcon}</span>
          <span>{transaction.status}</span>
        </strong>
        {transaction.status !== "PENDING" && (
          <div>
            <span>updated at</span>
            <span>{new Date(transaction.updatedAt).toDateString()}</span>
          </div>
        )}
      </div>
      <div className={"flex flex-col"}>
        <span className={"text-sm"}>Created At</span>
        <span>{new Date(transaction.createdAt).toDateString()}</span>
      </div>
    </div>
  );
};

export default TransactionPage;
