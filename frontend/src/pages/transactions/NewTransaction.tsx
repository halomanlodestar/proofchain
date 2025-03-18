import NewTransactionForm from "@/components/NewTransactionForm.tsx";

const NewTransaction = () => {
  return (
    <div className={"container-x container-y space-y-10"}>
      <h1 className={"text-2xl md:text-4xl"}>Create Transaction</h1>
      <NewTransactionForm />
    </div>
  );
};

export default NewTransaction;
