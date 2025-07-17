import Link from "next/link";

import { buttonVariants } from "@squishmeist/ui/atom";

import { api } from "~/trpc/server";
import { Action } from "./action";

export default async function Four() {
  const trpc = await api();
  const info = await trpc.org.getContractorStep4();

  return (
    <div>
      <p>{JSON.stringify(info)}</p>
      <div className="flex gap-2">
        <Link href="/org?step=3" className={buttonVariants()}>
          Back
        </Link>
        <Action />
      </div>
    </div>
  );
}
