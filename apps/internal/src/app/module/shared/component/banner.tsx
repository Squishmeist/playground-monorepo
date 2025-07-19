import { Badge } from "@squishmeist/ui/atom";

import { api } from "~/trpc/server";
import { Impersonate } from "./impersonate";

export async function Banner() {
  const trpc = await api();
  const session = await trpc.auth.session();
  if (!session) return;

  function internal() {
    if (session?.user.type === "INTERNAL") return session.user;
    if (session?.impersonatedBy) return session.impersonatedBy;
  }
  const internalUser = internal();

  return (
    <div className="sticky top-0 z-50 flex min-h-10 w-full items-center gap-2">
      {internalUser && <Badge variant="outline">Internal</Badge>}
      <Impersonate session={session} />
    </div>
  );
}
