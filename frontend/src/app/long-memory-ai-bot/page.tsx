"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { User, Trash2 } from "lucide-react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { user: string; agent: string | null }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    // const res = await fetch("http://127.0.0.1:8000/api/messages");
    const res = await fetch(
      "https://chatbot-agent-backend.vercel.app/api/messages"
    );
    const data = await res.json();
    setMessages(data.messages);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const userMessage = input;
    setInput("");

    // Show user message immediately with placeholder for agent
    const newMsg = { user: userMessage, agent: null };
    setMessages((prev) => [...prev, newMsg]);

    try {
      // const res = await fetch("http://127.0.0.1:8000/api/chat", {
      const res = await fetch(
        "https://chatbot-agent-backend.vercel.app/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: userMessage }),
        }
      );

      const data = await res.json();

      // Update the last message with agent response
      setMessages((prev) => {
        if (prev.length === 0) return prev; // prevent error
        const updated = [...prev];
        updated[updated.length - 1].agent =
          data.response || "Sorry, I couldn't process that.";
        return updated;
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        updated[updated.length - 1].agent = "Something went wrong.";
        return updated;
      });
    }

    setLoading(false);
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const deleteChatHistory = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-red-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-green-600 text-white p-4 shadow-lg flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">🎄</span>
          <h1 className="text-xl font-bold text-center">AI Chat Assistant</h1>
          <span className="text-2xl">🎅</span>
        </div>
        <p className="text-center text-red-100 text-sm">
          Ho ho ho! Ask me anything!
        </p>
        {/* Delete All Chats Button */}
        <div className="flex justify-center mt-2">
          <button
            onClick={deleteChatHistory}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm shadow"
          >
            <Trash2 className="h-4 w-4" /> Delete All Chats
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-red-50 to-green-50 relative">
        {messages.map((msg, idx) => (
          <div key={idx} className="space-y-2 relative z-10">
            <div className="text-right">
              <div className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-2xl rounded-tr-sm shadow-lg max-w-[80%]">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <span className="text-sm">
                    <User />
                  </span>
                  <span className="text-xs font-semibold">You</span>
                </div>
                <p className="text-sm">{msg.user}</p>
              </div>
            </div>

            <div className="text-left">
              {msg.agent ? (
                <Card className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-2xl rounded-tl-sm shadow-lg max-w-[80%] border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">🎄</span>
                    <span className="text-xs font-semibold">AI Assistant</span>
                  </div>
                  <p className="text-sm">{msg.agent}</p>
                </Card>
              ) : (
                <Card className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-2xl rounded-tl-sm shadow-lg border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">🎄</span>
                    <span className="text-xs font-semibold">
                      AI Assistant Thinking
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-red-300 rounded-full animate-bounce"></span>
                    <span
                      className="w-2 h-2 bg-green-300 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-red-300 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></span>
                  </div>
                </Card>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t-2 border-red-200 bg-white shadow-lg">
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-3 pr-12 border-2 border-green-300 rounded-full focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all"
              placeholder="🎄 Type your message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500">
              🎁
            </span>
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-green-600 text-white rounded-full hover:from-red-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin">🎄</span>
                <span>Sending...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Send</span>
                <span>🎅</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
