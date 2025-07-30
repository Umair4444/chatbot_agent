"use client"; // For Next.js App Router
import { useState } from "react";

export default function Quotes() {
  const [hustle, setHustle] = useState("");
  const [quote, setQuote] = useState("");
  const [bio, setBio] = useState<string[]>([]);

  const getHustle = async () => {
    const res = await fetch("http://127.0.0.1:8000/side_hustles?apikey=1234");
    const data = await res.json();
    console.log(data)
    setHustle(data.side_hustles);
  };

  const getQuote = async () => {
    const res = await fetch("http://127.0.0.1:8000/money_quotes?apikey=1234");
    const data = await res.json();
    console.log(data);
    setQuote(data.money_quotes);
  };

  const getFakeInfo = async () => {
    const res = await fetch("http://127.0.0.1:8000/fakeinfo");
    const data = await res.json();
    console.log(data);
    setBio(data.fictional_bio);
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">💡 AI Agent - GET API Demo</h1>

      <button
        onClick={getHustle}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Get Side Hustle
      </button>
      {hustle && <p className="text-lg">🚀 Side Hustle: {hustle}</p>}

      <button
        onClick={getQuote}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Get Money Quote
      </button>
      {quote && <p className="text-lg">💸 Money Quote: {quote}</p>}

      <button
        onClick={getFakeInfo}
        className="px-4 py-2 bg-purple-500 text-white rounded"
      >
        Get Fake Info
      </button>
      {bio.length > 0 && (
        <ul className="list-disc ml-6">
          {bio.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
