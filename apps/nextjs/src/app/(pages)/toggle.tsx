"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { toast } from "@squishmeist/ui/toast";

import { useTRPC } from "~/trpc/react";

export function Toggle() {
  const trpc = useTRPC();
  const router = useRouter();

  const { mutate } = useMutation(
    trpc.flag.updateFlag.mutationOptions({
      onSuccess: async (data) => {
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

  return (
    <div>
      <h2 className="text-xl font-semibold">Toggle Modules</h2>
      <button onClick={() => mutate({ name: "JOB" })}>
        toggle jobs
      </button>
    </div>
  );
}
