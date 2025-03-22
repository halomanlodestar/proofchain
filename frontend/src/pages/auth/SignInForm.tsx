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
import { signInFormSchema, SignInFormValues } from "@/schemas/authForms.tsx";
import { z } from "zod";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Link, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth.tsx";
import { AxiosError } from "axios";

const SignInForm = () => {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(values: SignInFormValues) {
    try {
      const parsedValues = signInFormSchema.parse(values);
      const { status } = await signIn(parsedValues);

      if (status === 200) {
        navigate("/");
        form.reset();
      }
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        console.log(e.status);
        form.setError("root", {
          message: e.response?.data.message,
        });
      }
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
          <h1 className={"text-3xl font-medium"}>Sign In</h1>
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
          <FormMessage>{form.formState.errors.root?.message}</FormMessage>
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
            Don't have an account?{" "}
            <Link to={"/auth/signup"} className={"text-blue-700 underline"}>
              {" "}
              Sign Up
            </Link>
          </FormDescription>
        </form>
      </Form>
    </Card>
  );
};

export default SignInForm;
