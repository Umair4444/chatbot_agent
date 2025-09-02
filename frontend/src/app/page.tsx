import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      <Card className="bg-transparent/10 backdrop-blur-md p-10 rounded-2xl shadow-xl space-y-6 text-center max-w-md">
        <h1 className="text-3xl font-extrabold text-gray-900">
          AI Agent Playground
        </h1>
        <div className="flex flex-col gap-3">
          <Link href="/quotes">
            <Button variant="default" className="w-full">
              Quotes
            </Button>
          </Link>

          <Link href="/simple-ai-bot">
            <Button
              variant="default"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            >
              Simple AI Chat Agent
            </Button>
          </Link>
          <Link href="/long-memory-ai-bot">
            <Button
              variant="default"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            >
              AI Memory Chat Bot Agent
            </Button>
          </Link>
          <Link href="/advanced-ai-bot">
            <Button
              variant="default"
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              AI Advanced Chat Bot Agent
            </Button>
          </Link>
          <Link href="/floating-ai-bot">
            <Button
              variant="default"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Floating AI Chat Bot Agent
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
