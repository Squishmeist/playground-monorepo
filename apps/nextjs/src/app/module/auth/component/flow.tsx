import { SignIn } from "./sign-in";
import { SignUp } from "./sign-up";

export function Flow() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <SignIn />
      <SignUp />
    </div>
  );
}
