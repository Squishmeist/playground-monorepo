"use client";

import { startImpersonation } from "~auth/impersonate";

import { AppRouterOutputs } from "@squishmeist/api";

interface Props {
  users: AppRouterOutputs["auth"]["externalUsers"];
}

export function Internal({ users }: Props) {
  return (
    <div>
      {users.map((user) => (
        <div
          key={user.id}
          className="border-b p-4 hover:cursor-pointer hover:bg-white/10"
          onClick={() => startImpersonation(user.id)}
        >
          <p>Name: {user.name}</p>
          <p>Type: {user.type}</p>
          <p>Role: {user.role}</p>
        </div>
      ))}
    </div>
  );
}
