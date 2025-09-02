"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Plus,
  MessageSquare,
  Settings,
  User,
  Bot,
  Sparkles,
  Trash,
  Menu,
} from "lucide-react";

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

export default function AIBotPage() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentSession = chatSessions.find((s) => s.id === currentSessionId);
  const messages = currentSession?.messages ?? [];

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      // Radix ScrollArea viewport
      const viewport = scrollAreaRef.current.querySelector<HTMLDivElement>(
        "[data-radix-scroll-area-viewport]"
      );

      if (viewport) {
        // Use requestAnimationFrame to ensure DOM updates first
        requestAnimationFrame(() => {
          viewport.scrollTop = viewport.scrollHeight;
        });
      }
    }
  };

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chatSessions");
    let restored: ChatSession[] = [];

    if (saved) {
      const parsed: ChatSession[] = JSON.parse(saved);
      restored = parsed.map((s) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        messages: s.messages.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
      }));
    }

    const hasNewChat = restored.some((s) => s.title === "New Chat");

    const initialMessage: Message = {
      id: Date.now().toString(),
      content: "Hello! I'm your AI assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    };

    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [initialMessage],
      createdAt: new Date(),
    };

    const updatedSessions = hasNewChat ? restored : [newSession, ...restored];

    setChatSessions(updatedSessions);
    setCurrentSessionId(updatedSessions[0]?.id ?? null);
    localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));
  }, []);

  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessageToSession = (msg: Message) => {
    if (!currentSessionId) return;
    setChatSessions((prev) =>
      prev.map((s) =>
        s.id === currentSessionId ? { ...s, messages: [...s.messages, msg] } : s
      )
    );
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    setIsTyping(true);

    let sessionId = currentSessionId;
    let isNewSession = false;

    // If no session exists, create one dynamically
    if (!sessionId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: "New Chat",
        messages: [], // start empty
        createdAt: new Date(),
      };

      setChatSessions((prev) => [newSession, ...prev]);
      sessionId = newSession.id;
      setCurrentSessionId(sessionId);
      isNewSession = true;
    }

    // User message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    // Add user message to session
    setChatSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, messages: [...s.messages, userMessage] }
          : s
      )
    );

    setInput("");
    setTimeout(() => inputRef.current?.focus(), 100);

    try {
      // const res = await fetch("http://127.0.0.1:8000/api/chat", {
      const res = await fetch(
        "https://chatbot-agentbackend.vercel.app/api/chat",
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

      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages: [...s.messages, assistantMessage] }
            : s
        )
      );
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Something went wrong.",
        role: "assistant",
        timestamp: new Date(),
      };

      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages: [...s.messages, errorMessage] }
            : s
        )
      );
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = (title?: string) => {
    const initialMessage: Message = {
      id: "1",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    };

    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: title || "New Chat", // default if no title
      messages: [initialMessage],
      createdAt: new Date(),
    };

    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const handleDeleteSession = (sessionId: string) => {
    const updatedSessions = chatSessions.filter((s) => s.id !== sessionId);
    setChatSessions(updatedSessions);

    if (currentSessionId === sessionId) {
      setCurrentSessionId(updatedSessions[0]?.id ?? null);
    }

    localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));
  };

  const handleDeleteAllSessions = () => {
    setChatSessions([]);
    setCurrentSessionId(null);
    localStorage.removeItem("chatSessions");
  };

  return (
    <div className="flex h-screen bg-[url('https://source.unsplash.com/random/1600x900')] bg-cover bg-center text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-sidebar border-r border-sidebar-border flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
            <SidebarContent closeSidebar={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat Header */}
        <div className="h-16 border-b border-border bg-primary flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Button
              className="md:hidden mr-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-heading font-bold text-lg">AI Assistant</h1>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse-slow"></div>
                <span className="text-sm text-foreground/90 font-semibold">
                  Online
                </span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            GPT-5
          </Badge>
        </div>

        {/* Messages Area */}
        <div className="flex-1 min-h-0 overflow-hidden bg-background">
          <ScrollArea ref={scrollAreaRef} className="h-full p-4">
            <div className="max-w-6xl mx-auto space-y-6 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 animate-message-in ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[70%] ${
                      message.role === "user" ? "order-first" : ""
                    }`}
                  >
                    <Card
                      className={`p-4 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground border-primary ml-auto"
                          : "bg-card text-card-foreground"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-pretty">
                        {message.content}
                      </p>
                    </Card>
                    <div
                      className={`text-xs text-muted-foreground mt-1 ${
                        message.role === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-4 animate-message-in">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <Card className="p-4 bg-card text-card-foreground ">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-typing"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-typing"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 shrink-0 bg-background sticky bottom-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Message AI Assistant..."
                  className="min-h-[44px] pr-12 resize-none bg-input border-border text-foreground placeholder:text-muted-foreground"
                  disabled={isTyping}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                className="h-11 w-11 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-foreground/80 mt-2 text-center">
              AI can make mistakes. Consider checking important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Sidebar Content Component
  function SidebarContent({ closeSidebar }: { closeSidebar?: () => void }) {
    return (
      <>
        <div className="p-4 border-b border-sidebar-border shrink-0">
          <Button
            onClick={() => {
              startNewChat();
              closeSidebar?.();
            }}
            className="w-full justify-start gap-2 bg-sidebar-accent hover:bg-sidebar-accent/90 text-sidebar-accent-foreground"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full p-2">
            <div className="space-y-1">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between gap-2 w-full rounded-lg p-3 cursor-pointer ${
                    currentSessionId === session.id
                      ? "bg-primary/10 hover:bg-primary/30"
                      : "hover:bg-primary/30"
                  }`}
                >
                  <Button
                    onClick={() => {
                      setCurrentSessionId(session.id);
                      closeSidebar?.();
                    }}
                    className="flex flex-1 items-center gap-2 text-left"
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <div className="flex-1 truncate">
                      <div className="truncate text-sm font-medium">
                        {session.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {session.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteSession(session.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="p-4 border-t border-sidebar-border shrink-0 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-sidebar-foreground">
                User
              </div>
              <div className="text-xs text-muted-foreground">Free Plan</div>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="destructive"
            size="sm"
            className="w-full mt-2"
            onClick={handleDeleteAllSessions}
          >
            <Trash className="h-4 w-4 mr-2" /> Delete All Chats
          </Button>
        </div>
      </>
    );
  }
}
