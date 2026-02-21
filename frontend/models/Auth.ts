import { z } from "zod";

export const signinSchema = z.object({
  email: z.email("メールアドレスを入力してください"),
});

export const signupSchema = z.object({
  email: z.email("メールアドレスを入力してください"),
});

export type SigninSchemaType = z.infer<typeof signinSchema>;
export type SignupSchemaType = z.infer<typeof signupSchema>;
