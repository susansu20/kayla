"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion } from "framer-motion";
import { Trophy, Building2, Sparkles, Gem, TrendingUp } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Accolade = {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: React.ReactNode;
  href?: string;
};

const ACCOLADES: Accolade[] = [
  {
    icon: <Trophy className="h-10 w-10" strokeWidth={1.4} />,
    eyebrow: "PropNex · 2023 · 2024 · 2025",
    title: "3× Rising Millionaire",
    body: (
      <span>
        Three years running. A trio of trophies that say{" "}
        <em className="text-gold">precision compounds</em>.
      </span>
    ),
  },
  {
    icon: <Building2 className="h-10 w-10" strokeWidth={1.4} />,
    eyebrow: "PropNex Realty",
    title: "Associate Division Director",
    body: <span>Leading the Kayla Wong Division — a team built on her standard.</span>,
  },
  {
    icon: <Sparkles className="h-10 w-10" strokeWidth={1.4} />,
    eyebrow: "EdgeProp · April 2026",
    title: "Featured on EdgeProp",
    body: (
      <span className="block">
        <em className="text-ivory/90">
          “From precision to property: How Kayla Wong helps buyers see what others miss.”
        </em>
      </span>
    ),
    href: "https://www.edgeprop.sg/property-news/precision-property-how-kayla-wong-helps-buyers-see-what-others-miss",
  },
  {
    icon: <Gem className="h-10 w-10" strokeWidth={1.4} />,
    eyebrow: "Business Network International",
    title: "BNI Elite Member",
    body: <span>Among the network's top contributors — referrals earned, not asked.</span>,
  },
  {
    icon: <TrendingUp className="h-10 w-10" strokeWidth={1.4} />,
    eyebrow: "And counting",
    title: "12.7K and growing",
    body: <span>A community of property buyers who trust her eye before they trust the listing.</span>,
  },
];

/**
 * Horizontal-scroll stage with GSAP ScrollTrigger pin.
 * The section pins the viewport and translates an inner track from 0 → -((n-1)*viewportW).
 * On mobile (md and below) we fall back to a vertical stack so the experience still works.
 */
export default function AchievementsStage() {
  const wrapperRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const ctx = gsap.context(() => {
      const totalScroll = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -totalScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: () => `+=${totalScroll()}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrapperRef}
      className="relative z-10 w-full overflow-hidden bg-midnight"
      aria-label="Kayla Wong — career accolades"
    >
      {/* Mobile: vertical stack */}
      <div className="md:hidden">
        <SectionHeader />
        <div className="flex flex-col gap-10 px-6 pb-24">
          {ACCOLADES.map((a, i) => (
            <AccoladeCard key={i} {...a} index={i} />
          ))}
        </div>
      </div>

      {/* Desktop: pinned horizontal track */}
      <div className="hidden md:block">
        <div
          ref={trackRef}
          className="flex h-[100svh] w-max items-center"
        >
          {/* Intro panel */}
          <div className="flex h-full w-[100vw] shrink-0 items-center justify-center px-12">
            <SectionHeader large />
          </div>
          {ACCOLADES.map((a, i) => (
            <div
              key={i}
              className="flex h-full w-[100vw] shrink-0 items-center justify-center px-12"
            >
              <AccoladeCard {...a} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ large = false }: { large?: boolean }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center md:py-0">
      <p className="text-xs uppercase tracking-[0.5em] text-gold/80">Act III</p>
      <h2
        className={`mt-4 font-serif ${
          large ? "text-5xl md:text-7xl" : "text-4xl md:text-5xl"
        }`}
      >
        A year that reads like a highlight reel.
      </h2>
      <p className="mt-6 font-serif italic text-ivory/70">
        Scroll on — each accolade catches the spotlight in turn.
      </p>
    </div>
  );
}

function AccoladeCard({
  icon,
  eyebrow,
  title,
  body,
  href,
  index,
}: Accolade & { index: number }) {
  const Wrapper: React.ElementType = href ? "a" : "div";

  // Mouse-tracked 3D tilt — only kicks in on devices that can hover.
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 8).toFixed(
      2
    )}deg) rotateY(${(px * 10).toFixed(2)}deg) translateZ(0)`;
  };
  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full max-w-xl"
    >
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="transition-transform duration-200 will-change-transform"
      >
        <Wrapper
          {...(href
            ? { href, target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="group relative block rounded-2xl bg-gradient-to-b from-midnight-2 to-midnight p-10 ring-1 ring-gold/30 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.15)]"
        >
          {/* Spotlight on hover */}
          <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.25),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
            {String(index + 1).padStart(2, "0")} · {eyebrow}
          </p>
          <div className="mt-6 inline-flex items-center justify-center rounded-full bg-gold/10 p-4 text-gold ring-1 ring-gold/40">
            {icon}
          </div>
          <h3 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
            {title}
          </h3>
          <p className="mt-4 font-serif text-lg italic text-ivory/80">{body}</p>
          {href && (
            <p className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-gold">
              Read the feature →
            </p>
          )}
        </Wrapper>
      </div>
    </motion.div>
  );
}
