"use client";

import { useEffect, useRef } from "react";

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  hue: number;
}

export default function BubbleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bubbles: Bubble[] = [];
    const BUBBLE_COUNT = 60;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < BUBBLE_COUNT; i++) {
      bubbles.push(createBubble(canvas));
    }

    function createBubble(canvas: HTMLCanvasElement): Bubble {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200,
        radius: Math.random() * 28 + 6,
        speedY: Math.random() * 0.6 + 0.2,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.35 + 0.08,
        hue: Math.random() * 60 + 200, // blue to purple range
      };
    }

    let animId: number;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach((b, i) => {
        ctx.beginPath();

        const gradient = ctx.createRadialGradient(
          b.x - b.radius * 0.3,
          b.y - b.radius * 0.3,
          b.radius * 0.1,
          b.x,
          b.y,
          b.radius
        );
        gradient.addColorStop(0, `hsla(${b.hue}, 80%, 80%, ${b.opacity * 1.5})`);
        gradient.addColorStop(0.5, `hsla(${b.hue}, 70%, 60%, ${b.opacity})`);
        gradient.addColorStop(1, `hsla(${b.hue}, 60%, 40%, 0)`);

        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // bubble rim highlight
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${b.hue}, 80%, 85%, ${b.opacity * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        b.y -= b.speedY;
        b.x += b.speedX;

        if (b.y + b.radius < 0) {
          bubbles[i] = createBubble(canvas);
        }
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
}
