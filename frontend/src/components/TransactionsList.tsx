import { TransactionMini } from "@/types";
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Ghost } from "lucide-react";

const TransactionItem = ({ transaction }: { transaction: TransactionMini }) => {
  return (
    <Link to={"/transactions/" + transaction.id}>
      <div className={"shadow-lg border rounded-lg p-4"}>
        <div className={"flex justify-between"}>
          <div>
            <div className={"text-lg font-semibold"}>
              {transaction.recipient.name}
            </div>
            <div className={"text-sm text-gray-500"}>
              {transaction.sender.name}
            </div>
          </div>
          <div className={"text-lg font-semibold"}>{transaction.amount}</div>
        </div>
        <div className={"text-sm text-gray-500"}>{transaction.status}</div>
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
    <div className={"space-y-2"}>
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
};

export default TransactionsList;
