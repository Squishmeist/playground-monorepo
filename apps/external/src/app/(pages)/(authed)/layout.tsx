import { AppSidebar } from "~shared/component";

import { SidebarProvider, SidebarTrigger } from "@squishmeist/ui/atom";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <header className="flex h-14 items-center gap-4 border-b p-4">
          <SidebarTrigger />
          <div className="size-10 flex-1 rounded-md border" />
          <div className="size-7 border" />
          <div className="size-7 border" />
        </header>
        <div className="space-y-6 p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
