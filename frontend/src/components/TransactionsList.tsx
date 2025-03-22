import { Transaction } from "@/types";

const TransactionsList = ({
  transactions,
}: {
  transactions?: Transaction[];
}) => {
  if (!transactions) {
    return <div>Loading</div>;
  }

  return (
    <div>
      {transactions.length === 0
        ? "No Transaction Here"
        : transactions.map((transaction) => (
            <div key={transaction.id}>
              <div>Amount: {transaction.amount}</div>
              <div>Recipient: {transaction.recipientId}</div>
              <div>Sender: {transaction.senderId}</div>
              <div>Status: {transaction.status}</div>
            </div>
          ))}
    </div>
  );
};

export default TransactionsList;
