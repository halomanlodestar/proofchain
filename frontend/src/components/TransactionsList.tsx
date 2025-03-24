import { TransactionMini } from "@/types";
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Ghost } from "lucide-react";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth.tsx";

const TransactionItem = ({ transaction }: { transaction: TransactionMini }) => {
  const { user } = useAuth();

  const isSender = user?.id === transaction.sender.id;
  const prefix = isSender ? "to" : "from";
  const otherName = !isSender
    ? transaction.recipient.name
    : transaction.sender.name;

  return (
    <Link to={"/transactions/" + transaction.id}>
      <div className={"flex flex-col p-3 rounded-2xl shadow-lg space-y-3"}>
        <div className={"flex items-center justify-between"}>
          <div className={"flex space-x-4 items-center"}>
            <div
              className={
                "bg-rose-700 text-rose-50 rounded-xl p-1.5 flex items-center justify-center"
              }
            >
              {isSender ? (
                <ArrowUpRight size={32} />
              ) : (
                <ArrowDownLeft size={32} />
              )}
            </div>
            <div className={"flex flex-col items-start -space-y-1"}>
              <span className={"text-sm"}>{prefix}</span>
              <span className={"text-lg"}>{otherName}</span>
            </div>
          </div>
          <div className={"text-lg font-semibold"}>{transaction.amount}€</div>
        </div>
        <div className={"flex justify-between items-center"}>
          <div>{new Date(transaction.initialisedAt).toDateString()}</div>
          <div>{transaction.mode}</div>
        </div>
      </div>
    </Link>
  );
};

const TransactionsList = ({
  transactions,
}: {
  transactions?: TransactionMini[];
}) => {
  if (!transactions) {
    // Create a loading state using Skeleton component similar to that of the list of transactions

    return (
      <div className={"space-y-2"}>
        <Skeleton className={"w-full h-24"} />
        <Skeleton className={"w-full h-24"} />
        <Skeleton className={"w-full h-24"} />
        <Skeleton className={"w-full h-24"} />
        <Skeleton className={"w-full h-24"} />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className={"flex items-center justify-center h-96"}>
        <div className={"flex justify-center items-center flex-col"}>
          <Ghost size={"100"} />
          <p className={"text-xl"}>No transactions</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        "gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
      }
    >
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
};

export default TransactionsList;
