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
import { DatePickerDemo } from "@/components/ui/datepicker.tsx";
import { Button } from "@/components/ui/button.tsx";
import { DynamicInput } from "@/components/DynamicInput.tsx";
import { api } from "@/lib/api-client.ts";
import { User } from "@/types";
import { AxiosError } from "axios";
import { oneDay } from "@/lib/constants.ts";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useAuth } from "@/hooks/use-auth.tsx";

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

  const { token } = useAuth();

  const fetchUsers = async (email: string): Promise<User[]> => {
    try {
      const res = await api.users.findByEmail(email);
      return [res.data.user];
    } catch (e: unknown) {
      if (e instanceof AxiosError) return [];
      return [];
    }
  };

  const onSubmit = async ({
    recipientId,
    expirationTime,
    amount,
  }: CreateTransactionValues) => {
    try {
      const { status } = await api.transaction.create(
        {
          amount,
          recipientId,
          expirationTime: expirationTime.toISOString(),
        },
        token!,
      );

      if (status === 201) {
        form.reset();
        toast.success("Transaction successfully created");
      }
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message);
      }

      if (e instanceof ZodError) {
        console.log(e);
      }
    }
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
                  fetchFunction={fetchUsers}
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
                <Input type={"number"} placeholder="shadcn" {...field} />
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
                <DatePickerDemo {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type={"submit"}>Create</Button>
      </form>
    </Form>
  );
};

export default NewTransactionForm;
