"use client"; // For Next.js App Router
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Quotes() {
  const [hustle, setHustle] = useState("");
  const [quote, setQuote] = useState("");
  const [bio, setBio] = useState<string[]>([]);

  const getHustle = async () => {
    // const res = await fetch("http://127.0.0.1:8000/side_hustles?apikey=1234");
    const res = await fetch(
      "https://chatbot-agent-backend.vercel.app/side_hustles?apikey=1234"
    );
    const data = await res.json();
    console.log(data);
    setHustle(data.side_hustles);
  };

  const getQuote = async () => {
    // const res = await fetch("http://127.0.0.1:8000/money_quotes?apikey=1234");
    const res = await fetch(
      "https://chatbot-agent-backend.vercel.app/money_quotes?apikey=1234"
    );
    const data = await res.json();
    setQuote(data.money_quotes);
  };

  const getFakeInfo = async () => {
    // const res = await fetch("http://127.0.0.1:8000/fakeinfo");
    const res = await fetch("https://chatbot-agent-backend.vercel.app/fakeinfo");
    const data = await res.json();
    setBio(data.fictional_bio);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      <div className="bg-transparent/10y dark:bg-black/70 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-xl w-full space-y-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          💡 AI Agent - GET API Demo
        </h1>

        <div className="space-y-4">
          <Button
            onClick={getHustle}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Get Side Hustle
          </Button>
          {hustle && (
            <p className="text-lg text-gray-800 dark:text-gray-200 bg-blue-500/30 p-2">
              🚀 Side Hustle: {hustle}
            </p>
          )}

          <Button
            onClick={getQuote}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Get Money Quote
          </Button>
          {quote && (
            <p className="text-lg text-gray-800 dark:text-gray-200 bg-green-500/30 p-2">
              💸 Money Quote: {quote}
            </p>
          )}

          <Button
            onClick={getFakeInfo}
            className="w-full bg-purple-500 hover:bg-purple-600"
          >
            Get Fake Info
          </Button>
          {bio.length > 0 && (
            <ul className="list-disc list-inside text-left text-gray-800 dark:text-gray-200 bg-purple-500/30 p-2">
              {bio.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
