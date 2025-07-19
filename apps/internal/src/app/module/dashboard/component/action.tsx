"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@squishmeist/ui/atom";
import { toast } from "@squishmeist/ui/toast";

import { useTRPC } from "~/trpc/react";

export function Action() {
  const trpc = useTRPC();
  const router = useRouter();

  const { mutate } = useMutation(
    trpc.flag.updateFlag.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message);
        router.refresh();
      },
      onError: (err) => {
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in"
            : "Failed to update flag",
        );
      },
    }),
  );

  const { mutate: testMutate } = useMutation(
    trpc.test.error.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message);
        router.refresh();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );

  return (
    <div className="flex flex-col items-start gap-2">
      <h2>Toggle Modules</h2>
      <div className="space-x-4">
        <Button onClick={() => mutate({ name: "JOB" })}>toggle jobs</Button>
        <Button onClick={() => testMutate({ error: true })}>throw error</Button>
      </div>
    </div>
  );
}
