"use client";

import { useEffect, useState } from "react";

const TITLES = ["Developer", "Designer", "Builder", "Creator"];

export default function HeroSection() {
  const [titleIdx, setTitleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = TITLES[titleIdx];
    if (!deleting && displayed.length < target.length) {
      const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 80);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === target.length) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setTitleIdx((i) => (i + 1) % TITLES.length);
    }
  }, [displayed, deleting, titleIdx]);

  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* Glassmorphism card */}
      <div
        className="relative max-w-3xl w-full rounded-3xl px-10 py-14 backdrop-blur-md"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 8px 60px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Decorative ring */}
        <div
          className="absolute -inset-px rounded-3xl pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.3) 0%, transparent 50%, rgba(59,130,246,0.2) 100%)",
          }}
        />

        <p className="text-sm font-semibold tracking-widest text-violet-400 uppercase mb-4">
          Welcome to my portfolio
        </p>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
          Hi, I&apos;m{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Doyun
          </span>
        </h1>

        <h2 className="text-2xl md:text-3xl font-medium text-slate-300 mb-6 h-10">
          <span className="text-violet-300">{displayed}</span>
          <span className="animate-pulse text-violet-400">|</span>
        </h2>

        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed mb-10">
          I build beautiful, interactive web experiences with modern technologies.
          Passionate about clean code and creative design.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            className="px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              boxShadow: "0 0 20px rgba(124,58,237,0.4)",
            }}
          >
            View My Work
          </button>
          <button
            className="px-8 py-3 rounded-full font-semibold text-violet-300 transition-all duration-300 hover:scale-105"
            style={{
              border: "1px solid rgba(139,92,246,0.5)",
              background: "rgba(139,92,246,0.08)",
            }}
          >
            Ask About Me ↓
          </button>
        </div>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-2 justify-center mt-10">
          {["Next.js", "TypeScript", "React", "TailwindCSS", "Node.js", "AI/ML"].map(
            (tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-medium text-slate-300 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {tech}
              </span>
            )
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 flex flex-col items-center gap-2 text-slate-500 text-xs">
        <span>scroll down</span>
        <div className="w-px h-8 bg-gradient-to-b from-violet-500 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
