"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ user: string; agent: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    // const res = await fetch("http://127.0.0.1:8001/api/messages");
    const res = await fetch("https://chatbot-agentbackend.vercel.app/api/messages");
    const data = await res.json();
    setMessages(data.messages);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    // const res = await fetch("http://127.0.0.1:8001/api/chat", {
      const res = await fetch("https://chatbot-agentbackend.vercel.app/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setInput("");
    setLoading(false);
    await fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
        {messages.map((msg, idx) => (
          <div key={idx} className="space-y-2">
            <div className="text-right bg-blue-100 p-2 rounded-lg">
              <strong>You:</strong> {msg.user}
            </div>
            <div className="text-left bg-green-100 p-2 rounded-lg">
              <strong>Agent:</strong> {msg.agent}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-white flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2  outline outline-2 rounded"
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
