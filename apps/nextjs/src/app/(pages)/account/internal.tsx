"use client";

import { useRouter } from "next/navigation";

import { users } from "./data";

export function Internal() {
  const externalUsers = users.filter((user) => user.type === "EXTERNAL");
  const router = useRouter();

  function impersonate(userId: string) {
    router.push(`/account?impersonate=${userId}`);
  }

  return (
    <div>
      {externalUsers.map((user) => (
        <div
          key={user.id}
          className="border-b p-4"
          onClick={() => impersonate(user.id)}
        >
          <p>Name: {user.name}</p>
          <p>Type: {user.type}</p>
          <p>Role: {user.role}</p>
        </div>
      ))}
    </div>
  );
}
