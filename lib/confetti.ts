"use client";

import confetti from "canvas-confetti";

const GOLD = ["#D4AF37", "#E8C76A", "#F5C6D6", "#FAF6F0"];

/** Symmetric bursts from the bottom corners — used when curtain opens. */
export function curtainBurst() {
  const opts: confetti.Options = {
    particleCount: 90,
    spread: 70,
    startVelocity: 55,
    ticks: 220,
    colors: GOLD,
    scalar: 1.1,
  };
  confetti({ ...opts, angle: 60, origin: { x: 0, y: 1 } });
  confetti({ ...opts, angle: 120, origin: { x: 1, y: 1 } });
}

/** Looping fireworks for the finale. Returns a stop fn. */
export function startFireworks(): () => void {
  let raf = 0;
  let stopped = false;
  const end = () => (stopped = true);

  const tick = () => {
    if (stopped) return;
    const x = Math.random();
    const y = Math.random() * 0.5;
    confetti({
      particleCount: 60,
      startVelocity: 30,
      spread: 360,
      ticks: 90,
      origin: { x, y },
      colors: GOLD,
      shapes: ["circle", "square"],
      scalar: 0.9,
    });
    raf = window.setTimeout(tick, 700 + Math.random() * 600) as unknown as number;
  };
  tick();
  return () => {
    end();
    clearTimeout(raf);
  };
}
