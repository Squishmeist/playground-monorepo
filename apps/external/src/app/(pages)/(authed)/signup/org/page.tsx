import { Suspense } from "react";
import { redirect } from "next/navigation";

import { api } from "~/trpc/server";
import Four from "./four";
import One from "./one";
import Three from "./three";
import Two from "./two";

interface Props {
  searchParams: Promise<{ step: string }>;
}

const StepComponents = [One, Two, Three, Four];

export default async function Page({ searchParams }: Props) {
  const { step } = await searchParams;
  const trpc = await api();

  const _step = Number(step);
  if (!_step) redirect("/signup/org?step=1");

  const access = await trpc.org.accessStep(_step);

  if (access.code === "NOT_IN_PROGRESS") {
    return <div>org is not in progress, status: {access.status}</div>;
  }
  if (access.code === "NOT_FOUND" || access.code === "FORBIDDEN")
    redirect(`/org?step=${access.step}`);

  const StepComponent = StepComponents[_step - 1];

  return (
    <div>
      <h1>Form Page {step}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {StepComponent ? <StepComponent /> : null}
      </Suspense>
    </div>
  );
}
