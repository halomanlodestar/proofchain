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
      expirationTime: new Date(),
      recipientId: "",
    },
  });

  const onSubmit = (values: CreateTransactionValues) => {
    console.log(values);
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
                {/*<Input type={"text"} placeholder="shadcn" {...field} />*/}
                <DynamicInput
                  fetchFunction={async (email) => {
                    const res = await api.users.findByEmail(email);
                    return [res.data.user];
                  }}
                  renderListItem={(user) => <ListItem {...user} />}
                  onSelect={(user) => {
                    console.log(user.id);
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
