import { useParams } from "react-router";
import NotFound from "@/pages/NotFound.tsx";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useAuth } from "@/hooks/use-auth.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Loader2 } from "lucide-react";
import { useTransactionMutations } from "@/mutations/transaction";

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

  const { acceptMutation, rejectMutation, deleteMutation } =
    useTransactionMutations(id!, refetch);

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
  const statusColor =
    transaction.status === "PENDING"
      ? "bg-yellow-200"
      : transaction.status === "SUCCESSFUL"
        ? "bg-green-200"
        : "bg-red-200";
  const statusIcon =
    transaction.status === "PENDING"
      ? "⏳"
      : transaction.status === "SUCCESSFUL"
        ? "✅"
        : "❌";

  return (
    <div className={"container-y container-x space-y-5 pt-5"}>
      <div className={`w-full flex flex-col space-y-2`}>
        <h2>Money Transferred</h2>
        <strong className={"text-3xl"}>&#8377;{transaction.amount}</strong>
      </div>
      <div
        className={`${statusColor} p-4 rounded-md flex flex-col sm:flex-row space-x-2 justify-between`}
      >
        <strong className={"flex space-x-2"}>
          <span>{statusIcon}</span>
          <span>{transaction.status}</span>
        </strong>
        {transaction.status !== "PENDING" && (
          <div className={"md:w-1/2"}>
            <span>updated at </span>
            <span> {new Date(transaction.updatedAt).toLocaleString()}</span>
          </div>
        )}
      </div>
      <div
        className={
          "flex flex-col space-y-5 md:flex-row md:space-y-0 justify-between"
        }
      >
        <div className={"flex flex-col w-1/2"}>
          <span className={"text-sm"}>Created At</span>
          <span className={"font-semibold text-secondary-foreground"}>
            {new Date(transaction.createdAt).toLocaleString()}
          </span>
        </div>

        <div className={"flex flex-col w-1/2"}>
          <span className={"text-sm"}>Expiring At</span>
          <span className={"font-semibold text-secondary-foreground"}>
            {new Date(transaction.expirationTime).toLocaleString()}
          </span>
        </div>
      </div>
      <div className={"flex flex-col"}>
        <span className={"text-sm"}>Mode of Payment</span>
        <span className={"font-semibold text-secondary-foreground"}>
          {transaction.mode}
        </span>
      </div>
      <div className={"flex items-center justify-between"}>
        <div className={"flex flex-col w-1/2"}>
          <span className={"text-sm"}>Sender</span>
          <span className={"font-semibold text-secondary-foreground"}>
            {transaction.sender.name}
          </span>
        </div>
        <div className={"flex flex-col w-1/2"}>
          <span className={"text-sm"}>Recipient</span>
          <span className={"font-semibold text-secondary-foreground"}>
            {transaction.recipient.name}
          </span>
        </div>
      </div>

      {isRecipient && transaction.status === "PENDING" && (
        <div className={"flex space-x-5"}>
          {/* Accept Transaction Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"success"}>Accept</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Accept Transaction</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to accept this transaction? This action
                cannot be undone
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={"secondary"}>Cancel</Button>
                </DialogClose>
                <Button
                  disabled={acceptMutation.isPending}
                  onClick={() => acceptMutation.mutate()}
                >
                  {acceptMutation.isPending && (
                    <Loader2 className={"animate-spin"} />
                  )}
                  Yes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Reject Transaction Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"destructive"}>Reject</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Transaction</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to reject this transaction? This action
                cannot be undone
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={"secondary"}>Cancel</Button>
                </DialogClose>
                <Button onClick={() => rejectMutation.mutate()}>
                  {rejectMutation.isPending && (
                    <Loader2 className={"animate-spin"} />
                  )}
                  Yes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
      {!isRecipient && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"destructive"}>Delete</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Transaction</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to reject this transaction? This action
              cannot be undone
            </p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"secondary"}>Cancel</Button>
              </DialogClose>
              <Button
                variant={"destructive"}
                onClick={() => deleteMutation.mutate()}
              >
                {deleteMutation.isPending && (
                  <Loader2 className={"animate-spin"} />
                )}
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TransactionPage;
