"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod/v4";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@squishmeist/ui/atom";
import { Form, FormInput, useForm } from "@squishmeist/ui/form";
import { toast } from "@squishmeist/ui/toast";

import { useTRPC } from "~/trpc/react";

export function Create() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
  });
  const form = useForm({
    schema: formSchema,
    defaultValues: {
      title: "",
      description: undefined,
    },
  });

  const { mutate } = useMutation(
    trpc.job.create.mutationOptions({
      onSuccess: async () => {
        form.reset();
        toast.success("Job created successfully");
        await queryClient.invalidateQueries(trpc.job.all.pathFilter());
      },
      onError: (err) => {
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to job"
            : "Failed to create job",
        );
      },
    }),
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Create</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <form
            className="space-y-2"
            onSubmit={form.handleSubmit((data) => mutate(data))}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Create a Job</AlertDialogTitle>
              <AlertDialogDescription />
            </AlertDialogHeader>
            <FormInput
              control={form.control}
              name="title"
              placeholder="Title"
            />
            <FormInput
              control={form.control}
              name="description"
              placeholder="Description"
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction type="submit">Create</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
