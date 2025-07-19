import { api } from "~/trpc/server";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const trpc = await api();
  const org = await trpc.org.id(Number(id));

  console.log("Org data:", org);

  if (!org || org.code === "NOT_FOUND")
    return <div>Organisation not found</div>;

  if (org.code !== "APPROVED") {
    return (
      <div>
        <h1>Organisation Page</h1>
        <p>{JSON.stringify(org)}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Organisation Page</h1>
      <p>ID: {id}</p>
      <p>Name: {org.data.name}</p>
    </div>
  );
}
