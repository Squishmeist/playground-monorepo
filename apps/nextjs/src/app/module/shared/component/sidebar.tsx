import { SignOut } from "~auth/component";

import { jobFlag, settingFlag } from "../../flag";
import { Nav } from "./nav";

export async function Sidebar() {
  const items: { href: string; label: string; flag: boolean }[] = [
    { href: "/", label: "Dashboard", flag: true },
    { href: "/job", label: "Job", flag: await jobFlag() },
    { href: "/setting", label: "Setting", flag: await settingFlag() },
  ];

  return (
    <aside className="flex h-full min-w-64 flex-col justify-between gap-6 border-r border-gray-600 bg-background p-6">
      <div className="space-y-6">
        <h1>Playground</h1>
        <Nav items={items} />
      </div>
      <div>
        <SignOut />
      </div>
    </aside>
  );
}
