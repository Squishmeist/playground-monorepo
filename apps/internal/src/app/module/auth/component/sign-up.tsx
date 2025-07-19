"use client";

import { useRouter } from "next/navigation";
import { z } from "zod/v4";

import { Button } from "@squishmeist/ui/atom";
import { Form, FormInput, useForm } from "@squishmeist/ui/form";
import { toast } from "@squishmeist/ui/toast";

import { authClient } from "../client";

export function SignUp() {
  const { signUp } = authClient;
  const router = useRouter();

  const formSchema = z.object({
    email: z.email("Invalid email").min(1, "Email is required"),
    name: z.string().min(1, "Name is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  });
  type FormType = z.infer<typeof formSchema>;

  const form = useForm({
    schema: formSchema,
    defaultValues: {
      email: "",
      name: "",
      username: "",
      password: "",
    },
  });

  async function handleSignUp(data: FormType) {
    await signUp.email(
      {
        email: data.email,
        name: data.name,
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
          await handleSignUp(data);
        })}
      >
        <FormInput
          control={form.control}
          name="email"
          placeholder="Email"
          type="email"
        />
        <FormInput control={form.control} name="name" placeholder="Name" />
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
        <Button type="submit">Signup</Button>
      </form>
    </Form>
  );
}
