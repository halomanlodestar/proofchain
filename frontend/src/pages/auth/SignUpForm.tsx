import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpFormSchema, SignUpFormValues } from "@/schemas/authForms.tsx";
import { z } from "zod";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Link, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api-client.ts";

const SignUpForm = () => {
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const navigate = useNavigate();

  async function onSubmit(values: SignUpFormValues) {
    const parsedValues = signUpFormSchema.parse(values);

    const { status } = await api.auth.signUp(parsedValues);

    if (status === 200) {
      navigate("/");
      form.reset();
    }
  }

  return (
    <Card
      className={
        "sm:p-6 border-transparent sm:border-border shadow-none sm:shadow-sm"
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 [&_input]:w-full"
        >
          <h1 className={"text-3xl font-medium"}>Sign Up</h1>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type={"password"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            className={"w-full"}
            type="submit"
          >
            {form.formState.isSubmitting && (
              <Loader2 className={"animate-spin"} />
            )}
            Submit
          </Button>
          <FormDescription>
            Already have an account?{" "}
            <Link to={"/auth/signin"} className={"text-blue-700 underline"}>
              {" "}
              Sign In
            </Link>
          </FormDescription>
        </form>
      </Form>
    </Card>
  );
};

export default SignUpForm;
