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

  return (
    <div className="flex flex-col items-start gap-2">
      <h2 className="text-xl font-semibold">Toggle Modules</h2>
      <button
        className="rounded-lg bg-gray-800 p-2 text-white hover:cursor-pointer hover:bg-gray-700"
        onClick={() => mutate({ name: "JOB" })}
      >
        toggle jobs
      </button>
    </div>
  );
}
