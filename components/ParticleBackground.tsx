"use client";

import { useMemo } from "react";

/**
 * Soft gold particle drift behind every act. Pure CSS — no canvas — to keep it
 * cheap. 24 particles, randomized once on mount.
 */
export default function ParticleBackground() {
  const dots = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 18,
        duration: 14 + Math.random() * 12,
        opacity: 0.25 + Math.random() * 0.5,
      })),
    []
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute bottom-[-10vh] rounded-full bg-gold blur-[1px] animate-drift"
          style={{
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            boxShadow: "0 0 8px rgba(212,175,55,0.6)",
          }}
        />
      ))}
    </div>
  );
}
