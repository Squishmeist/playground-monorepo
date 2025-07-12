import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";

import { Button } from "@squishmeist/ui/button";
import { toast } from "@squishmeist/ui/toast";

import { auth, getSession } from "../server";

export async function SignIn() {
  return (
    <form className="flex max-w-80 flex-col gap-4">
      <input type="text" name="username" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <Button
        size="lg"
        formAction={async (formData) => {
          "use server";
          try {
            const username = formData.get("username") as string;
            const password = formData.get("password") as string;

            const res = await auth.api.signInUsername({
              body: {
                username,
                password,
              },
              headers: await headers(),
            });
            if (!res) {
              console.error("Failed to sign in");
              return;
            }
          } catch (error) {
            console.error("Error signing in:", error);
          }
          redirect("/");
        }}
      >
        Sign in with Username
      </Button>
    </form>
  );
}
