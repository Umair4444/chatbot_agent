"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, MessageCircle, X, Minimize2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load sessions from localStorage
  useEffect(() => {
    const storedSessions = localStorage.getItem("chatSessions");
    const storedCurrentId = localStorage.getItem("currentSessionId");

    if (storedSessions && storedCurrentId) {
      const sessions: ChatSession[] = JSON.parse(storedSessions).map(
        (s: ChatSession) => ({
          ...s,
          messages: s.messages.map((m: Message) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
          createdAt: new Date(s.createdAt),
        })
      );

      const sessionExists = sessions.find((s) => s.id === storedCurrentId);
      if (sessionExists) {
        setChatSessions(sessions);
        setCurrentSessionId(storedCurrentId);
        return;
      }
    }

    // Create a new session if none exist
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setChatSessions([newSession]);
    setCurrentSessionId(newSession.id);
  }, []);

  const currentSession = chatSessions.find((s) => s.id === currentSessionId);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer)
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  // Helper to add message & persist immediately
  const updateSessionMessages = (sessionId: string, newMessage: Message) => {
    setChatSessions((prev) => {
      const updated = prev.map((s) =>
        s.id === sessionId ? { ...s, messages: [...s.messages, newMessage] } : s
      );
      localStorage.setItem("chatSessions", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;
    setIsTyping(true);

    const sessionId = currentSessionId!;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    // Add user message
    updateSessionMessages(sessionId, userMessage);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 100);

    try {
      // const res = await fetch("http://127.0.0.1:8000/api/chat", {
      const res = await fetch(
        "https://chatbot-agent-backend.vercel.app/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: userMessage.content }),
        }
      );
      const data = await res.json();

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.response ?? "Sorry, I couldn't process that.",
        role: "assistant",
        timestamp: new Date(),
      };

      updateSessionMessages(sessionId, assistantMessage);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Something went wrong.",
        role: "assistant",
        timestamp: new Date(),
      };
      updateSessionMessages(sessionId, errorMessage);
    }

    setIsTyping(false);
  };

  const handleCloseChat = () => {
    // Remove current session from memory
    const remainingSessions = chatSessions.filter(
      (s) => s.id !== currentSessionId
    );

    // Create a new session
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };

    const updatedSessions = [newSession, ...remainingSessions];
    setChatSessions(updatedSessions);
    setCurrentSessionId(newSession.id);

    // Close chat box
    setIsOpen(false);
    setIsMinimized(false);

    // Persist
    localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));
    localStorage.setItem("currentSessionId", newSession.id);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 bg-gradient-to-r from-primary to-primary/90 flex items-center justify-center gap-2"
      >
        <MessageCircle className="h-6 w-6" />
        <span>Open chat</span>
      </Button>
    );
  }

  return (
    <div className="fixed bottom-2 right-2 z-50">
      <Card
        className={`w-96 shadow-2xl border border-border/50 transition-all duration-300 ${
          isMinimized ? "h-auto w-64 max-w-full" : "h-[500px]"
        } flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5 shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseChat}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 min-h-0">
              <div className="space-y-4 min-h-full">
                {currentSession?.messages.length === 0 && (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 text-primary/60 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Hi! I&apos;m your AI assistant. How can I help you today?
                    </p>
                  </div>
                )}

                {currentSession?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="h-6 w-6 shrink-0">
                      {message.role === "assistant" ? (
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs">
                          <Bot className="h-3 w-3" />
                        </AvatarFallback>
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground text-xs">
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm break-words ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-pretty">{message.content}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2">
                    <Avatar className="h-6 w-6 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs">
                        <Bot className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border/50 shrink-0">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 text-sm"
                  disabled={isTyping}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                />
                <Button
                  size="sm"
                  disabled={!input.trim() || isTyping}
                  onClick={handleSendMessage}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
