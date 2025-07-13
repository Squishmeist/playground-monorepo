"use client";

import { AppRouterOutputs } from "@squishmeist/api";

import { startImpersonation } from "~/app/module/auth/impersonate";

interface Props {
  users: AppRouterOutputs["auth"]["externalUsers"];
}

export function Internal({ users }: Props) {
  return (
    <div>
      {users.map((user) => (
        <div
          key={user.id}
          className="border-b p-4 hover:cursor-pointer hover:bg-gray-800"
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
