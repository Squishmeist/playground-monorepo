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
    trpc.org.contractorStep4.mutationOptions({
      onSuccess: (suc) => {
        toast.success(suc.message);
        router.push(`/signup/org?step=4`);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );

  function onClick() {
    mutate({
      hasInstalledEvPoint: false,
      numPointsInstalled: 10,
    });
  }

  return <Button onClick={onClick}>Submit</Button>;
}
