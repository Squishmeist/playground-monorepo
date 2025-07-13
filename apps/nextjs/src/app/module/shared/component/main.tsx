import { Sidebar } from "./sidebar";

interface Props {
  children: React.ReactNode;
}

export function Main({ children }: Props) {
  return (
    <main className="flex h-full">
      <Sidebar />
      <div className="flex h-full w-full flex-col">
        <div className="h-14 bg-background" />
        <div className="flex w-full flex-1 flex-col gap-4 rounded-tl-3xl border border-gray-600 bg-secondary p-6">
          {children}
        </div>
      </div>
    </main>
  );
}
