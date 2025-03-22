import { Transaction } from "@/types";

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  return (
    <div>
      <div>Amount: {transaction.amount}</div>
      <div>Recipient: {transaction.recipientId}</div>
      <div>Sender: {transaction.senderId}</div>
      <div>Status: {transaction.status}</div>
    </div>
  );
};

const TransactionsList = ({
  transactions,
}: {
  transactions?: Transaction[];
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
