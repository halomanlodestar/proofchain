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
import { Check, Eye, EyeClosed, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth.tsx";
import { useState } from "react";
import { AxiosError } from "axios";

const SignUpForm = () => {
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(values: SignUpFormValues) {
    try {
      const parsedValues = signUpFormSchema.parse(values);

      const { status: signUpStatus } = await signUp(parsedValues);

      let status: number = 400;

      if (signUpStatus === 201) {
        const { status: signInStatus } = await signIn(parsedValues);
        status = signInStatus;
      }

      if (status === 200) {
        setSuccess(true);
        form.reset();

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (e) {
      if (e instanceof AxiosError) {
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
                  <div className={"flex items-center relative w-full pt-4"}>
                    <Input
                      placeholder="shadcn"
                      type={isPasswordShown ? "text" : "password"}
                      className={"w-full absolute"}
                      {...field}
                    />
                    <Button
                      type={"button"}
                      variant={"link"}
                      className={"absolute right-2 z-10"}
                      onClick={() => setIsPasswordShown(!isPasswordShown)}
                    >
                      {isPasswordShown ? <Eye /> : <EyeClosed />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormMessage>{form.formState.errors.root?.message}</FormMessage>
          <br />
          <Button
            disabled={form.formState.isSubmitting}
            className={`w-full`}
            variant={success ? "success" : "default"}
            type="submit"
          >
            {form.formState.isSubmitting && (
              <Loader2 className={"animate-spin"} />
            )}
            {success && <Check />}
            {success ? "Done" : "Submit"}
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
