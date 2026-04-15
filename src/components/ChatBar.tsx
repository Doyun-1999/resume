"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "어떤 기술 스택을 주로 사용하나요?",
  "최근 작업한 프로젝트는?",
  "AI에 관심이 있나요?",
  "What's your tech stack?",
];

export default function ChatBar() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const userText = text ?? input.trim();
    if (!userText || loading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userText },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantText,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "죄송해요, 오류가 발생했습니다. 다시 시도해주세요.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center px-4 pb-4">
      {/* Chat panel */}
      {isOpen && (
        <div
          className="w-full max-w-2xl mb-3 rounded-2xl overflow-hidden flex flex-col"
          style={{
            height: 380,
            background: "rgba(10,10,20,0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(139,92,246,0.25)",
            boxShadow: "0 -8px 60px rgba(139,92,246,0.12), 0 8px 40px rgba(0,0,0,0.5)",
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-3 flex items-center gap-2 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(139,92,246,0.15)" }}
          >
            <Sparkles size={16} className="text-violet-400" />
            <span className="text-sm font-semibold text-violet-300">Ask about me</span>
            <span className="text-xs text-slate-500 ml-1">— powered by Claude AI</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-slate-500 text-sm text-center">
                  궁금한 점을 물어보세요 ✨
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setIsOpen(true);
                        sendMessage(s);
                      }}
                      className="px-3 py-1.5 text-xs text-slate-300 rounded-full transition-all hover:scale-105"
                      style={{
                        background: "rgba(139,92,246,0.15)",
                        border: "1px solid rgba(139,92,246,0.3)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background:
                      msg.role === "user"
                        ? "rgba(139,92,246,0.3)"
                        : "rgba(59,130,246,0.3)",
                  }}
                >
                  {msg.role === "user" ? (
                    <User size={14} className="text-violet-300" />
                  ) : (
                    <Bot size={14} className="text-blue-300" />
                  )}
                </div>
                <div
                  className="max-w-xs md:max-w-sm px-3 py-2 rounded-xl text-sm text-slate-200 leading-relaxed"
                  style={{
                    background:
                      msg.role === "user"
                        ? "rgba(139,92,246,0.2)"
                        : "rgba(255,255,255,0.06)",
                    border:
                      msg.role === "user"
                        ? "1px solid rgba(139,92,246,0.3)"
                        : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {msg.content || (
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
                      <span className="animate-bounce" style={{ animationDelay: "150ms" }}>·</span>
                      <span className="animate-bounce" style={{ animationDelay: "300ms" }}>·</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input bar */}
      <div
        className="w-full max-w-2xl flex items-center gap-3 px-4 py-3 rounded-2xl"
        style={{
          background: "rgba(10,10,20,0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(139,92,246,0.3)",
          boxShadow: "0 0 40px rgba(139,92,246,0.1)",
        }}
      >
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: isOpen
              ? "rgba(139,92,246,0.4)"
              : "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.4)",
          }}
        >
          <Bot size={16} className="text-violet-300" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="저에 대해 궁금한 점을 물어보세요..."
          className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none"
        />

        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-30"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #2563eb)",
          }}
        >
          <Send size={14} className="text-white" />
        </button>
      </div>
    </div>
  );
}
