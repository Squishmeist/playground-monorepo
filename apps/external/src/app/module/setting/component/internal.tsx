"use client";

import { startImpersonation } from "~auth/impersonate";

import type { AppRouterOutputs } from "@squishmeist/api";

interface Props {
  users?: AppRouterOutputs["auth"]["externalUsers"];
}

export function Internal({ users }: Props) {
  return (
    <div className="space-y-4">
      <h2>External Users</h2>
      <div className="rounded-lg bg-background">
        {users?.map((user) => (
          <div
            key={user.id}
            className="rounded-lg border-b p-4 hover:cursor-pointer hover:bg-white/10"
            onClick={() => startImpersonation(user.id)}
          >
            <p>Name: {user.name}</p>
            <p>Type: {user.type}</p>
            <p>Role: {user.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
