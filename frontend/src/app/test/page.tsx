"use client"; // For Next.js App Router
import { useState } from "react";

export default function AIAgentPage() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");

  // 🔹 Call GET
  const callGet = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/test?input=${input}`);
    const data = await res.json();
    setReply(data.response || data.error);
  };

  // 🔹 Call POST
  const callPost = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    const data = await res.json();
    setReply(data.response || data.error);
  };

  return (
    <div className="p-4">
      <input
        className="border p-2 mr-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type something"
      />
      <button className="bg-blue-500 text-white px-4 py-2 mr-2" onClick={callGet}>
        Call GET
      </button>
      <button className="bg-green-500 text-white px-4 py-2" onClick={callPost}>
        Call POST
      </button>
      {reply && <p className="mt-4">Response: {reply}</p>}
    </div>
  );
}
