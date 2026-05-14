"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

type Props = {
  /** True once the curtain has opened — gates the entrance animation. */
  start: boolean;
};

/**
 * Five hero photos zoom in one by one from the depth of the stage, land in a
 * cinematic collage filling the viewport. The hero name floats above once
 * everything is settled.
 *
 * Each card uses framer-motion's stagger for the entrance; the trick to the
 * "from the background" feel is a low-opacity, small-scale start combined with
 * a slight blur that lifts as the card settles.
 */

type CardSpec = {
  src: string;
  alt: string;
  /** Final position via inset percentages (left/right/top/bottom). */
  pos: React.CSSProperties;
  rotate: number;
  /** Width as a fraction of viewport — both axes use clamp() to stay sensible. */
  w: string;
  /** z-index — higher cards land on top. */
  z: number;
};

const CARDS: CardSpec[] = [
  {
    src: "/kayla/01-rising-millionaire.jpg",
    alt: "Kayla Wong — PropNex Rising Millionaire 2024",
    pos: { left: "3%", top: "8%" },
    rotate: -6,
    w: "clamp(180px, 26vw, 360px)",
    z: 4,
  },
  {
    src: "/kayla/02-top-200-achievers.jpg",
    alt: "Kayla Wong at PropNex Top 200 Achievers wall, 180th",
    pos: { right: "4%", top: "5%" },
    rotate: 5,
    w: "clamp(170px, 24vw, 340px)",
    z: 5,
  },
  {
    src: "/kayla/03-marina-view.jpg",
    alt: "Kayla relaxing with a marina view",
    pos: { left: "8%", bottom: "6%" },
    rotate: 8,
    w: "clamp(160px, 22vw, 320px)",
    z: 3,
  },
  {
    src: "/kayla/04-emerald-katong.jpg",
    alt: "Kayla Wong at Emerald of Katong showroom",
    pos: { right: "6%", bottom: "8%" },
    rotate: -7,
    w: "clamp(170px, 23vw, 330px)",
    z: 4,
  },
  {
    src: "/kayla/05-library.jpg",
    alt: "Kayla Wong in a European library",
    pos: { left: "50%", top: "50%", transform: "translate(-50%, -50%)" },
    rotate: 0,
    w: "clamp(180px, 22vw, 320px)",
    z: 2,
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.55,
      delayChildren: 0.3,
    },
  },
};

const card = {
  hidden: { opacity: 0, scale: 0.15, filter: "blur(14px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function PhotoMosaic({ start }: Props) {
  const reduce = useReducedMotion();

  return (
    <section className="relative z-10 h-[100svh] w-full overflow-hidden spotlight">
      {/* Photo collage */}
      <motion.div
        className="absolute inset-0"
        variants={container}
        initial="hidden"
        animate={start ? "show" : "hidden"}
        aria-hidden={!start}
      >
        {CARDS.map((c, i) => (
          <motion.div
            key={c.src}
            variants={reduce ? undefined : card}
            initial={reduce ? { opacity: 0 } : undefined}
            animate={
              reduce
                ? start
                  ? { opacity: 1, transition: { delay: i * 0.2 } }
                  : { opacity: 0 }
                : undefined
            }
            className="absolute"
            style={{
              ...c.pos,
              width: c.w,
              zIndex: c.z,
              transform: `${c.pos.transform ?? ""} rotate(${c.rotate}deg)`,
            }}
          >
            <PolaroidFrame>
              <Image
                src={c.src}
                alt={c.alt}
                width={800}
                height={1000}
                priority={i < 2}
                className="h-auto w-full select-none object-cover"
                draggable={false}
              />
            </PolaroidFrame>
          </motion.div>
        ))}
      </motion.div>

      {/* Vignette so the text reads above the photos */}
      <div className="pointer-events-none absolute inset-0 z-[6] bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,rgba(10,14,39,0.15)_0%,rgba(10,14,39,0.7)_55%,rgba(10,14,39,0.92)_100%)]" />

      {/* Hero text */}
      <motion.div
        className="absolute inset-0 z-[7] flex flex-col items-center justify-center px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 1.2, delay: 3.6, ease: "easeOut" }}
      >
        <p className="font-script text-6xl text-gold drop-shadow-[0_4px_30px_rgba(212,175,55,0.6)] md:text-8xl">
          Happy Birthday
        </p>
        <h1 className="mt-3 font-serif text-5xl tracking-[0.18em] md:text-7xl lg:text-8xl">
          KAYLA WONG
        </h1>
        <p className="mt-4 text-sm uppercase tracking-[0.5em] text-gold/90">
          黄雅莉 · 🕊️
        </p>
        <motion.p
          className="mt-10 text-xs uppercase tracking-[0.4em] text-ivory/70"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          scroll to celebrate her year ↓
        </motion.p>
      </motion.div>
    </section>
  );
}

/** White polaroid-style frame with a faint gold glow. */
function PolaroidFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[6px] bg-ivory p-2 pb-4 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7),0_0_30px_rgba(212,175,55,0.25)] ring-1 ring-gold/30">
      <div className="overflow-hidden rounded-[3px]">{children}</div>
    </div>
  );
}
