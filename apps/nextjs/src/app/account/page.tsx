import Link from "next/link";

export default function Page() {
  return (
    <main className="container h-screen py-16">
      <h1 className="mb-8 text-3xl font-bold">Account</h1>
      <Link href="/" className="text-blue-500 hover:underline">
        Go to Home Page
      </Link>
    </main>
  );
}
