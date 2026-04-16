"use client";

import { useEffect, useRef } from "react";

const TRAIL_LENGTH = 12;

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const trail: { x: number; y: number }[] = [];
    let rafId: number;
    let mouseX = -200;
    let mouseY = -200;
    let dirty = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dirty = true;
    };

    const tick = () => {
      if (dirty) {
        dirty = false;

        if (glowRef.current) {
          glowRef.current.style.transform = `translate(${mouseX - 200}px, ${mouseY - 200}px)`;
        }

        if (dotRef.current) {
          dotRef.current.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
        }

        trail.push({ x: mouseX, y: mouseY });
        if (trail.length > TRAIL_LENGTH) trail.shift();

        trailRefs.current.forEach((el, i) => {
          if (!el) return;
          const point = trail[i];
          if (!point) {
            el.style.opacity = "0";
            return;
          }
          const ratio = i / TRAIL_LENGTH;
          const size = 3 + ratio * 5;
          el.style.opacity = String(ratio * 0.35);
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
          el.style.transform = `translate(${point.x - size / 2}px, ${point.y - size / 2}px)`;
        });
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Soft glow */}
      <div
        ref={glowRef}
        className="fixed pointer-events-none z-10 rounded-full"
        style={{
          width: 400,
          height: 400,
          top: 0,
          left: 0,
          willChange: "transform",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.1) 0%, rgba(59,130,246,0.05) 50%, transparent 70%)",
          transition: "transform 0.1s ease-out",
        }}
      />

      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-20 rounded-full"
        style={{
          width: 10,
          height: 10,
          top: 0,
          left: 0,
          willChange: "transform",
          background: "rgba(124,58,237,0.85)",
          boxShadow: "0 0 10px 3px rgba(124,58,237,0.3)",
          transition: "transform 0.04s ease-out",
        }}
      />

      {/* Trail */}
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          className="fixed pointer-events-none z-10 rounded-full"
          style={{
            top: 0,
            left: 0,
            willChange: "transform, opacity",
            background: "rgba(124,58,237,1)",
            opacity: 0,
          }}
        />
      ))}
    </>
  );
}
