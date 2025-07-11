"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { toast } from "@squishmeist/ui/toast";

import { useTRPC } from "~/trpc/react";

export function Test() {
  const trpc = useTRPC();
  const router = useRouter();

  const { mutate } = useMutation(
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
      <h2 className="text-xl font-semibold">Test</h2>
      <button
        className="rounded-lg bg-gray-800 p-2 text-white hover:cursor-pointer hover:bg-gray-700"
        onClick={() => mutate({ error: true })}
      >
        throw error
      </button>
    </div>
  );
}
