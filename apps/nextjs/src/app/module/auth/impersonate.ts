"use server";

import { cookies } from "next/headers";

export async function startImpersonation(userId: string) {
  // Set impersonation cookie
  const cookieStore = await cookies();
  cookieStore.set("impersonate-user", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}
