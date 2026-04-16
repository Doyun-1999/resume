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
            height: 360,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow:
              "0 -4px 30px rgba(124,58,237,0.08), 0 20px 60px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-3 flex items-center gap-2 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
          >
            <Sparkles size={15} style={{ color: "#7c3aed" }} />
            <span className="text-sm font-semibold" style={{ color: "#1e293b" }}>
              Ask about me
            </span>
            <span className="text-xs ml-1" style={{ color: "#94a3b8" }}>
              — powered by Claude AI
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-sm text-center" style={{ color: "#94a3b8" }}>
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
                      className="px-3 py-1.5 text-xs rounded-full transition-all hover:scale-105"
                      style={{
                        color: "#7c3aed",
                        background: "rgba(124,58,237,0.07)",
                        border: "1px solid rgba(124,58,237,0.2)",
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
                        ? "rgba(124,58,237,0.12)"
                        : "rgba(37,99,235,0.1)",
                  }}
                >
                  {msg.role === "user" ? (
                    <User size={13} style={{ color: "#7c3aed" }} />
                  ) : (
                    <Bot size={13} style={{ color: "#2563eb" }} />
                  )}
                </div>
                <div
                  className="max-w-xs md:max-w-sm px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={{
                    color: "#1e293b",
                    background:
                      msg.role === "user" ? "rgba(124,58,237,0.08)" : "#f8fafc",
                    border:
                      msg.role === "user"
                        ? "1px solid rgba(124,58,237,0.18)"
                        : "1px solid #e2e8f0",
                  }}
                >
                  {msg.content || (
                    <span className="inline-flex gap-1" style={{ color: "#94a3b8" }}>
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
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.9) inset",
        }}
      >
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: isOpen ? "rgba(124,58,237,0.15)" : "rgba(124,58,237,0.08)",
            border: "1px solid rgba(124,58,237,0.25)",
          }}
        >
          <Bot size={15} style={{ color: "#7c3aed" }} />
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
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "#1e293b" }}
        />

        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-30"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #2563eb)",
            boxShadow: "0 2px 8px rgba(124,58,237,0.3)",
          }}
        >
          <Send size={13} className="text-white" />
        </button>
      </div>
    </div>
  );
}
