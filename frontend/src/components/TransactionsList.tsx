import { TransactionMini } from "@/types";
import { Link } from "react-router";

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
              {transaction.sender.name} (YOU)
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
    return <div>Loading</div>;
  }

  return (
    <div className={"space-y-2"}>
      {transactions.length === 0
        ? "No Transaction Here"
        : transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
    </div>
  );
};

export default TransactionsList;
