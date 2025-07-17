import { api } from "~/trpc/server";
import { Action } from "./action";

export default async function One() {
  const trpc = await api();
  const info = await trpc.org.getContractorStep1();

  return (
    <div>
      <p>{JSON.stringify(info)}</p>
      <Action />
    </div>
  );
}
