"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { curtainBurst } from "@/lib/confetti";
import { playBgm } from "@/lib/audio";

type Props = {
  onOpen: () => void;
};

/**
 * Act 1 — the velvet curtain entry gate.
 * - Two SVG panels (left/right) with vertical fold gradients and tassels.
 * - A single CTA pulses; on click GSAP parts the curtains, fires confetti,
 *   starts the music, and signals the parent to unlock scroll.
 * - Mobile (≤768px) falls back to a vertical zip via media-query CSS.
 */
export default function Curtain({ onOpen }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const [opening, setOpening] = useState(false);

  // Lock body scroll while curtain is closed.
  useEffect(() => {
    document.body.classList.add("locked");
    return () => document.body.classList.remove("locked");
  }, []);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);

    // Kick off audio inside the user gesture so autoplay policies are happy.
    try {
      playBgm();
    } catch {
      /* noop */
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        document.body.classList.remove("locked");
        onOpen();
        // Remove the curtain DOM after the animation
        if (wrapRef.current) wrapRef.current.style.display = "none";
      },
    });

    tl.to(ctaRef.current, { autoAlpha: 0, duration: 0.4 }, 0);

    if (isMobile) {
      // Vertical zip: split top/bottom
      tl.to(leftRef.current, { yPercent: -100, duration: 2.2 }, 0.15)
        .to(rightRef.current, { yPercent: 100, duration: 2.2 }, 0.15);
    } else {
      tl.to(leftRef.current, { xPercent: -105, duration: 2.5 }, 0.15)
        .to(rightRef.current, { xPercent: 105, duration: 2.5 }, 0.15);
    }

    // Confetti right as the parting begins.
    setTimeout(() => curtainBurst(), 250);
  };

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-50 select-none"
      aria-label="Birthday surprise entry"
    >
      {/* Velvet panels */}
      <div className="absolute inset-0 flex">
        <div
          ref={leftRef}
          className="curtain-panel relative h-full w-1/2 animate-sway"
        >
          <CurtainSVG side="left" />
        </div>
        <div
          ref={rightRef}
          className="curtain-panel relative h-full w-1/2 animate-sway"
        >
          <CurtainSVG side="right" />
        </div>
      </div>

      {/* CTA */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <button
          ref={ctaRef}
          onClick={handleOpen}
          className="pointer-events-auto group relative rounded-full bg-gradient-to-b from-gold-soft to-gold px-8 py-5 text-lg font-medium tracking-wide text-midnight shadow-gold-lg animate-heartbeat focus:outline-none focus-visible:ring-4 focus-visible:ring-rose/60 md:px-12 md:py-6 md:text-xl"
          aria-label="Open your birthday surprise"
        >
          <span className="relative z-10">
            ✨ Open Your Surprise, Kayla ✨
          </span>
          <span className="absolute inset-0 rounded-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.35),transparent)] bg-[length:200%_100%] animate-shimmer" />
        </button>
      </div>

      {/* Subtle hint at bottom */}
      <p className="pointer-events-none absolute bottom-8 left-0 right-0 text-center font-serif text-sm italic text-ivory/70">
        a surprise has been waiting for you…
      </p>
    </div>
  );
}

function CurtainSVG({ side }: { side: "left" | "right" }) {
  // Five vertical "folds" via repeating gradient + a tassel rope on the inner edge.
  const isLeft = side === "left";
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 200 800"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={`velvet-${side}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#3D0710" />
          <stop offset="20%" stopColor="#7A0F22" />
          <stop offset="50%" stopColor="#5B0A19" />
          <stop offset="80%" stopColor="#7A0F22" />
          <stop offset="100%" stopColor="#3D0710" />
        </linearGradient>
        <pattern
          id={`folds-${side}`}
          width="40"
          height="800"
          patternUnits="userSpaceOnUse"
        >
          <rect width="40" height="800" fill={`url(#velvet-${side})`} />
          <rect
            x="0"
            width="2"
            height="800"
            fill="#2A050C"
            opacity="0.55"
          />
          <rect
            x="38"
            width="2"
            height="800"
            fill="#9C1A30"
            opacity="0.25"
          />
        </pattern>
        <linearGradient id={`shade-${side}`} x1="0" x2="1" y1="0" y2="0">
          {isLeft ? (
            <>
              <stop offset="0%" stopColor="#000" stopOpacity="0.25" />
              <stop offset="80%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#000" stopOpacity="0.55" />
              <stop offset="20%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
            </>
          )}
        </linearGradient>
      </defs>
      <rect width="200" height="800" fill={`url(#folds-${side})`} />
      <rect width="200" height="800" fill={`url(#shade-${side})`} />
      {/* Gold tassel rope along inner edge */}
      <g opacity="0.9">
        {Array.from({ length: 20 }).map((_, i) => {
          const y = 20 + i * 40;
          const x = isLeft ? 196 : 4;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="3" fill="#D4AF37" />
              <line
                x1={x}
                y1={y + 3}
                x2={x}
                y2={y + 16}
                stroke="#D4AF37"
                strokeWidth="1.5"
              />
            </g>
          );
        })}
      </g>
      {/* Top valance shadow */}
      <rect width="200" height="60" fill="#000" opacity="0.35" />
    </svg>
  );
}
