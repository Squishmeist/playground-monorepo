import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@squishmeist/ui/button";

import { auth } from "../server";

export async function SignUp() {
  return (
    <form className="flex max-w-80 flex-col gap-4">
      <input type="email" name="email" placeholder="Email" required />
      <input type="text" name="name" placeholder="Name" required />
      <input type="text" name="username" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <Button
        size="lg"
        formAction={async (formData) => {
          "use server";
          try {
            const email = formData.get("email") as string;
            const name = formData.get("name") as string;
            const username = formData.get("username") as string;
            const password = formData.get("password") as string;

            const res = await auth.api.signUpEmail({
              body: {
                email,
                name,
                password,
                username,
              },
              headers: await headers(),
            });
            if (!res) {
              console.log("No URL returned from signInSocial");
              return;
            }
          } catch (error) {
            console.error("Error signing up:", error);
          }
          redirect("/");
        }}
      >
        Sign up
      </Button>
    </form>
  );
}
