"use client";
import { useState } from "react";

export default function AIAgentPage() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { sender: "user" | "ai"; message: string }[]
  >([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to history
    setChatHistory((prev) => [...prev, { sender: "user", message: input }]);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      console.log("API Response:", data);

      const aiReply =
        data.response || data.reply || data.message || "No response received";

      // Add AI reply to history
      setChatHistory((prev) => [...prev, { sender: "ai", message: aiReply }]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", message: "Something went wrong." },
      ]);
    } finally {
      setInput("");
    }
  };

  return (
    <div className="bg-slate-200 h-screen grid grid-rows-[auto_1fr_auto]">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-md">
        <h1 className="text-2xl font-bold">💬 Chat with AI Agent</h1>
      </div>

      {/* Chat History Area */}
      <div className="px-6 py-4 overflow-y-auto space-y-4">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg w-fit max-w-lg ${
              msg.sender === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "bg-gray-600 text-white"
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="bg-white px-6 py-4 border-t grid grid-cols-[6fr_1fr] gap-4">
        <input
          className="p-2 border-2 border-black rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
