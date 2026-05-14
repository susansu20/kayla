"use client";

import { useEffect, useRef } from "react";

/**
 * Soft gold glow following the pointer. Pure DOM transform, no React state in
 * the hot path. Hidden on touch devices (we check `(hover: hover)` at runtime).
 */
export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.documentElement.classList.add("custom-cursor-active");
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let tx = -100;
    let ty = -100;
    let x = -100;
    let y = -100;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] h-8 w-8 rounded-full bg-gold/40 mix-blend-screen blur-md"
      style={{ boxShadow: "0 0 30px rgba(212,175,55,0.6)" }}
    />
  );
}
