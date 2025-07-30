import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold mb-6">AI Agent Playground</h1>
        <Link
          href="/quotes"
          className="block px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Quotes
        </Link>
        <Link
          href="/test"
          className="block px-6 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
        >
          Testing
        </Link>
        <Link
          href="/statelessai"
          className="block px-6 py-2 rounded bg-purple-500 text-white hover:bg-purple-600 transition"
        >
          Stateless Agent
        </Link>
        <Link
          href="/statefulai"
          className="block px-6 py-2 rounded bg-pink-500 text-white hover:bg-pink-600 transition"
        >
          Stateful Agent
        </Link>
      </div>
    </div>
  );
}
