import { Create } from "~job/component";

import { api } from "~/trpc/server";

export default async function Page() {
  const trpc = await api();
  const job = await trpc.job.all();

  return (
    <>
      <div className="flex w-full flex-row items-center justify-between">
        <div>
          <h1>Job</h1>
          <p>Track and manage job assignments across your groups.</p>
        </div>
        <Create />
      </div>
      <div>
        <h2>Job List</h2>
        <ul>
          {job.map((j) => (
            <li key={j.id}>
              <strong>{j.title}</strong> - {j.description}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
