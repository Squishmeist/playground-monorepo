import Link from "next/link";
import { Flow } from "~auth/component";
import { getSession } from "~auth/server";
import { Action } from "~dashboard/component";
import { Main } from "~shared/component";

import { jobFlag, settingFlag } from "~/app/module/flag";

export default async function Page() {
  const session = await getSession();

  if (!session) return <Unauthed />;
  return <Authed />;
}

function Unauthed() {
  return (
    <main className="flex h-screen w-full flex-col items-center gap-2 pt-20">
      <h1>Auth</h1>
      <Flow />
    </main>
  );
}

async function Authed() {
  return (
    <Main>
      <Action />
    </Main>
  );
}
