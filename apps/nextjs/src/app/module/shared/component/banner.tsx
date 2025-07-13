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
    <div className="sticky top-0 z-50 w-full">
      {internalUser && (
        <div className="bg-blue-400 px-2 py-1">{`INTERNAL USER: ${internalUser.name}`}</div>
      )}
      <Impersonate session={session} />
    </div>
  );
}
