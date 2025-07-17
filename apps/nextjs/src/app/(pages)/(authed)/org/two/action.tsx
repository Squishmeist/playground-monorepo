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
    trpc.org.contractorStep2.mutationOptions({
      onSuccess: (suc) => {
        toast.success(suc.message);
        router.push(`/org?step=3`);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );

  function onClick() {
    mutate({
      street: "123 Example St",
      city: "Example City",
      county: "Example County",
      postcode: "12345",
    });
  }

  return <Button onClick={onClick}>Next</Button>;
}
