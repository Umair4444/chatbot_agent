"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export default function AIAgentPage() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { sender: "user" | "ai"; message: string }[]
  >([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    setChatHistory((prev) => [
      ...prev,
      { sender: "user", message: userMessage },
    ]);

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
      const aiReply =
        data.response || data.reply || data.message || "No response received";
      setChatHistory((prev) => [...prev, { sender: "ai", message: aiReply }]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", message: "Something went wrong." },
      ]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fefce8]">
      <header className="bg-card border-b border-border px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#4b5563] tracking-tight">
            🎩 Classical AI Assistant
          </h1>
          <p className="text-sm sm:text-base text-[#6b7280] mt-1 sm:mt-2 font-medium">
            Engage in thoughtful conversation with our distinguished AI
            companion
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-8 py-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {chatHistory.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <span className="text-2xl">💭</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#4b5563] mb-2">
                Welcome to Classical Chat
              </h2>
              <p className="text-[#6b7280] max-w-md mx-auto">
                Begin your conversation with our AI assistant. Ask questions,
                seek advice, or simply chat about any topic that interests you.
              </p>
            </div>
          )}

          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <Card
                className={`max-w-2xl px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground border-primary/20"
                    : "bg-card text-card-foreground border-border"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#fefce8]/20 flex items-center justify-center text-sm font-medium">
                    {msg.sender === "user" ? "You" : "AI"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-medium leading-relaxed">
                      {msg.message}
                    </p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-[#ffffff] border-t border-border px-4 sm:px-8 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share your thoughts or ask a question..."
              className="flex-1 resize-none min-h-[48px] max-h-[120px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-full h-14 text-lg sm:w-auto"
            >
              Send
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </footer>
    </div>
  );
}
