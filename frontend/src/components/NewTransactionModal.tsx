import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import NewTransactionForm from "@/components/NewTransactionForm.tsx";

const NewTransactionModal = () => {
  return (
    <Dialog>
      <Button asChild variant={"outline"}>
        <DialogTrigger>
          <Plus />
          Create
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={"text-2xl"}>Create Transaction</DialogTitle>
        </DialogHeader>
        <NewTransactionForm />
      </DialogContent>
    </Dialog>
  );
};

export default NewTransactionModal;
