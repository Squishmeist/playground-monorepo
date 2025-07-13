import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";

import { Button } from "@squishmeist/ui/button";
import { toast } from "@squishmeist/ui/toast";

import { auth, getSession } from "../server";

export async function SignOut() {
  return (
    <div className="flex flex-col justify-center gap-4">
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
