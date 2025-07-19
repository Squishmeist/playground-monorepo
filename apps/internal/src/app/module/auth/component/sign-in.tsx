"use client";

import { useRouter } from "next/navigation";
import { z } from "zod/v4";

import { Button } from "@squishmeist/ui/atom";
import { Form, FormInput, useForm } from "@squishmeist/ui/form";
import { toast } from "@squishmeist/ui/toast";

import { authClient } from "../client";

export function SignIn() {
  const { signIn } = authClient;
  const router = useRouter();

  const formSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  });
  type FormType = z.infer<typeof formSchema>;

  const form = useForm({
    schema: formSchema,
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function handleSignIn(data: FormType) {
    await signIn.username(
      {
        username: data.username,
        password: data.password,
      },
      {
        onError: (error) => {
          toast.error(error.error.message);
        },
        onSuccess: () => {
          toast.success("Signed in successfully");
          router.refresh();
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(async (data) => {
          await handleSignIn(data);
        })}
      >
        <FormInput
          control={form.control}
          name="username"
          placeholder="Username"
        />
        <FormInput
          control={form.control}
          name="password"
          type="password"
          placeholder="Password"
        />
        <Button type="submit">Signin</Button>
      </form>
    </Form>
  );
}
