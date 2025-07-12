import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";

import { Button } from "@squishmeist/ui/button";
import { toast } from "@squishmeist/ui/toast";

import { auth, getSession } from "../server";

interface Props {
  name: string;
}

export async function SignOut({ name }: Props) {
  return (
    <div className="flex flex-col justify-center gap-4">
      <p className="text-2xl">
        <span>Logged in as {name}</span>
      </p>

      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await auth.api.signOut({
              headers: await headers(),
            });
            redirect("/");
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
