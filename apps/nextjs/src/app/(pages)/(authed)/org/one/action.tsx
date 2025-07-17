"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@squishmeist/ui/atom";
import { toast } from "@squishmeist/ui/toast";

import { useTRPC } from "~/trpc/react";

export function Action() {
  const trpc = useTRPC();
  const router = useRouter();

  const { mutate, isPending } = useMutation(
    trpc.org.contractorStep1.mutationOptions({
      onSuccess: (suc) => {
        toast.success(suc.message);
        router.push(`/org?step=2`);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );

  function onClick() {
    mutate({
      name: "Test Organisation",
    });
  }

  return (
    <Button disabled={isPending} onClick={onClick}>
      Next
    </Button>
  );
}
