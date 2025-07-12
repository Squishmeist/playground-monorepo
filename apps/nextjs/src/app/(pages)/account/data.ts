export type User = {
  id: string;
  name: string;
  type: "INTERNAL" | "EXTERNAL";
  role: "admin" | "user";
};

export const users: User[] = [
  { id: "1", name: "John Doe", type: "INTERNAL", role: "admin" },
  { id: "2", name: "Jane Smith", type: "EXTERNAL", role: "user" },
];
