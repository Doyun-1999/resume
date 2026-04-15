"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const trailIdRef = useRef(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      setPos({ x, y });

      const id = ++trailIdRef.current;
      setTrail((prev) => [...prev.slice(-12), { x, y, id }]);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* Large soft glow that follows cursor */}
      <div
        className="fixed pointer-events-none z-10 rounded-full"
        style={{
          width: 400,
          height: 400,
          left: pos.x - 200,
          top: pos.y - 200,
          background:
            "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.08) 50%, transparent 70%)",
          transition: "left 0.08s ease-out, top 0.08s ease-out",
        }}
      />

      {/* Inner bright cursor dot */}
      <div
        className="fixed pointer-events-none z-20 rounded-full"
        style={{
          width: 12,
          height: 12,
          left: pos.x - 6,
          top: pos.y - 6,
          background: "rgba(167,139,250,0.9)",
          boxShadow: "0 0 12px 4px rgba(139,92,246,0.6)",
          transition: "left 0.03s ease-out, top 0.03s ease-out",
        }}
      />

      {/* Trailing dots */}
      {trail.map((t, i) => {
        const opacity = (i / trail.length) * 0.5;
        const size = 4 + (i / trail.length) * 6;
        return (
          <div
            key={t.id}
            className="fixed pointer-events-none z-10 rounded-full"
            style={{
              width: size,
              height: size,
              left: t.x - size / 2,
              top: t.y - size / 2,
              background: `rgba(139,92,246,${opacity})`,
              transition: "opacity 0.3s",
            }}
          />
        );
      })}
    </>
  );
}
