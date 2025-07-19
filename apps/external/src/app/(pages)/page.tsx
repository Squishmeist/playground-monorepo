import { redirect } from "next/navigation";
import { Flow } from "~auth/component";
import { getSession } from "~auth/server";

export default async function Page() {
  const session = await getSession();

  if (session) return redirect("/dashboard");
  return <Unauthed />;
}

function Unauthed() {
  return (
    <main className="flex h-screen w-full flex-col items-center gap-2 pt-20">
      <h1>Auth</h1>
      <Flow />
    </main>
  );
}
