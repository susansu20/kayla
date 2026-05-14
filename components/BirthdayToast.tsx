"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Act IV — pinned section. As you scroll, the right flute slides in toward the
 * left flute and the gold liquid fills both. When they meet (≈75% progress), a
 * subtle "ting" plays and the caption fades up.
 */
export default function BirthdayToast() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 0 → 100% fill (clipped via gradient stop)
  const fill = useTransform(scrollYProgress, [0.05, 0.6], [0, 100]);
  const fillStr = useTransform(fill, (v) => `${v.toFixed(0)}%`);
  // Right flute slides from off-screen to clink position
  const rightX = useTransform(scrollYProgress, [0.1, 0.7], [240, 0]);
  const rightRot = useTransform(scrollYProgress, [0.1, 0.7], [25, -8]);
  // Caption opacity
  const captionOpacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 1]);

  // Trigger ting sound when scroll passes the clink point.
  const [tinged, setTinged] = useState(false);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v > 0.72 && !tinged) {
        setTinged(true);
        playTing();
      }
      if (v < 0.5 && tinged) setTinged(false);
    });
    return () => unsub();
  }, [scrollYProgress, tinged]);

  return (
    <section
      ref={ref}
      className="relative z-10 h-[260svh] w-full bg-gradient-to-b from-midnight via-midnight-2 to-midnight"
      aria-label="Birthday toast"
    >
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 spotlight" />

        <div className="relative flex w-full max-w-5xl items-end justify-center gap-2 md:gap-12 px-6">
          <Flute fillPct={fillStr} side="left" />
          <motion.div
            style={{ x: rightX, rotate: rightRot }}
            className="origin-bottom-left"
          >
            <Flute fillPct={fillStr} side="right" />
          </motion.div>
        </div>

        <motion.figure
          style={{ opacity: captionOpacity }}
          className="absolute inset-x-0 bottom-16 mx-auto max-w-3xl px-8 text-center"
        >
          <blockquote className="font-serif text-xl italic leading-relaxed text-ivory/90 md:text-2xl">
            “To the woman who turns precision into a property buyer's superpower —
            here's to another year of record-breaking sales, fearless growth,
            and the buyers who are lucky to find you first.”
          </blockquote>
          <figcaption className="mt-6 text-xs uppercase tracking-[0.5em] text-gold/80">
            — a toast 🥂
          </figcaption>
        </motion.figure>

        <p className="absolute top-10 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.5em] text-gold/80">
          Act IV · the toast
        </p>
      </div>
    </section>
  );
}

/** SVG champagne flute that fills from the bottom. */
function Flute({
  fillPct,
  side,
}: {
  fillPct: import("framer-motion").MotionValue<string>;
  side: "left" | "right";
}) {
  // Translate the liquid rect downward by (100 - fillPct)% of its height,
  // so that as fill grows, the rect rises into the bowl.
  const liquidY = useTransform(fillPct, (v) => 180 - (parseInt(v, 10) / 100) * 180);
  return (
    <svg
      viewBox="0 0 120 320"
      className="h-[60vh] w-auto max-w-[40vw] md:h-[70vh]"
      aria-hidden
    >
      <defs>
        <linearGradient id={`liquid-${side}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#F2D478" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#A07C1A" />
        </linearGradient>
        <linearGradient id={`glass-${side}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
        </linearGradient>
        <clipPath id={`bowl-${side}`}>
          {/* Bowl shape — narrow at the bottom, widens, then necks in. */}
          <path d="M30,10 Q60,40 60,90 Q60,150 35,180 L85,180 Q60,150 60,90 Q60,40 90,10 Z" />
        </clipPath>
      </defs>

      {/* Liquid */}
      <g clipPath={`url(#bowl-${side})`}>
        <motion.rect
          x="0"
          width="120"
          height="180"
          y={liquidY}
          fill={`url(#liquid-${side})`}
        />
      </g>

      {/* Bowl outline */}
      <path
        d="M30,10 Q60,40 60,90 Q60,150 35,180 L85,180 Q60,150 60,90 Q60,40 90,10 Z"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.5"
      />
      <path
        d="M30,10 Q60,40 60,90 Q60,150 35,180 L85,180 Q60,150 60,90 Q60,40 90,10 Z"
        fill={`url(#glass-${side})`}
        opacity="0.55"
      />

      {/* Stem */}
      <rect x="58" y="180" width="4" height="110" fill="rgba(255,255,255,0.35)" />
      {/* Base */}
      <ellipse cx="60" cy="298" rx="34" ry="6" fill="rgba(255,255,255,0.35)" />

      {/* A few bubbles */}
      <g fill="rgba(255,255,255,0.7)">
        <circle cx="55" cy="120" r="1.4">
          <animate attributeName="cy" from="160" to="20" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0" to="0" values="0;1;0" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="70" cy="100" r="1">
          <animate attributeName="cy" from="170" to="30" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0" to="0" values="0;1;0" dur="5s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}

function playTing() {
  try {
    const Ctx =
      typeof window !== "undefined"
        ? (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)
        : null;
    if (!Ctx) return;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 1480;
    o.type = "sine";
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.95);
    o.onended = () => ctx.close();
  } catch {
    /* noop */
  }
}
