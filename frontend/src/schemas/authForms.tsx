import { z } from "zod";

export const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

export const signUpFormSchema = z.object({
  name: z.string().min(3, {
    message: "Name is required",
  }),
  email: z.string().email(),
  phone: z.string().min(6, {
    message: "Invalid phone number",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
export type SignInFormValues = z.infer<typeof signInFormSchema>;
