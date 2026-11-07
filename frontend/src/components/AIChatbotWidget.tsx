"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  time: string;
}

export default function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Greetings! I am Sommelier Jean, your AI Culinary Concierge. How may I assist your dining experience today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setIsLoading(true);

    try {
      // Call FastAPI RAG Chatbot Backend (proxied via Next.js rewrites)
      const res = await fetch("/api/v1/chatbot/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMsg.text.slice(0, 500) }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: data.answer,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text:
              res.status === 429
                ? "You're sending messages too quickly. Please wait a moment and try again."
                : "Our concierge is temporarily unavailable. Please try again shortly.",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Unable to reach our concierge right now. Please check your connection and try again.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chatbot Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-bold shadow-2xl shadow-amber-500/30 hover:scale-105 transition-transform flex items-center justify-center cursor-pointer border border-amber-300"
        aria-label="Open AI Culinary Concierge"
      >
        <span className="text-xl">🤖</span>
      </button>

      {/* Floating AI Chatbox Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 260 }}
            className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] h-[480px] bg-zinc-950 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border-b border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 font-serif font-bold text-sm">
                  AI
                </div>
                <div>
                  <h4 className="text-sm font-serif font-bold text-white leading-none">
                    Sommelier Jean AI
                  </h4>
                  <span className="text-[10px] text-amber-400 font-mono">
                    RAG Knowledge Assistant
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    m.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[82%] p-3 rounded-xl text-xs leading-relaxed ${
                      m.sender === "user"
                        ? "bg-amber-500 text-zinc-950 font-medium rounded-br-none"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-zinc-500 font-mono mt-0.5 px-1">
                    {m.time}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start">
                  <div className="bg-zinc-900 border border-zinc-800 text-amber-400 text-xs p-3 rounded-xl animate-pulse">
                    Consulting RAG Culinary Database...
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 bg-zinc-900/80 border-t border-zinc-800 flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about dishes, wine pairings, booking..."
                className="flex-grow px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold text-xs rounded hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
