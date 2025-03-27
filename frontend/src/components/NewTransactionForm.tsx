import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import {
  createTransactionSchema,
  CreateTransactionValues,
} from "@/schemas/createTransaction.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input.tsx";
import { DatePicker } from "@/components/ui/datepicker.tsx";
import { Button } from "@/components/ui/button.tsx";
import { DynamicInput } from "@/components/DynamicInput.tsx";
import { api } from "@/lib/api-client.ts";
import { User } from "@/types";
import { AxiosError } from "axios";
import { oneDay } from "@/lib/constants.ts";
import { useAuth } from "@/hooks/use-auth.tsx";
import { Loader2 } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog.tsx";
import { useTransactionMutations } from "@/mutations/transaction.ts";

const ListItem = (user: User) => {
  return (
    <div>
      <p>{user.name}</p>
    </div>
  );
};

const NewTransactionForm = () => {
  const form = useForm<CreateTransactionValues>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount: 0,
      expirationTime: new Date(Date.now() + oneDay),
      recipientId: "",
    },
  });

  const { user } = useAuth();

  const { createMutation } = useTransactionMutations();

  const fetchUsers = async (email: string): Promise<User[]> => {
    try {
      const res = await api.users.findByEmail(email);
      return [res.data.user];
    } catch (e: unknown) {
      if (e instanceof AxiosError) return [];
      return [];
    }
  };

  const onSubmit = async (data: CreateTransactionValues) => {
    if (data.recipientId === user?.id) {
      form.setError("recipientId", {
        type: "manual",
        message: "You cannot send money to yourself",
      });
      return;
    }
    await createMutation.mutateAsync(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 [&_input]:w-full"
      >
        <FormField
          control={form.control}
          name="recipientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient</FormLabel>
              <FormControl>
                <DynamicInput
                  className={"w-full"}
                  fetchFunction={fetchUsers}
                  placeholder={"Enter email to search"}
                  renderListItem={(user) => <ListItem {...user} />}
                  onSelect={(user) => {
                    field.onChange(user.id);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  min={0}
                  type={"number"}
                  placeholder="shadcn"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expirationTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expires At</FormLabel>
              <FormControl>
                <DatePicker classNameButton={"w-full"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button
            disabled={createMutation.isPending}
            type={"submit"}
            size={"lg"}
            className={"w-full"}
          >
            {createMutation.isPending && <Loader2 className={"animate-spin"} />}{" "}
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default NewTransactionForm;
