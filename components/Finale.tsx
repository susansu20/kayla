"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { startFireworks } from "@/lib/confetti";

export default function Finale() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: false });

  // Loop fireworks while the finale is in view. Stop when it scrolls away.
  useEffect(() => {
    if (!inView) return;
    const stop = startFireworks();
    return stop;
  }, [inView]);

  return (
    <section
      ref={ref}
      className="relative z-10 flex min-h-[110svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-midnight-2 via-midnight to-midnight px-6 py-24"
      aria-label="Finale"
    >
      <p className="text-xs uppercase tracking-[0.5em] text-gold/80">Act VI</p>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="mt-8 max-w-4xl text-center font-script text-5xl leading-tight text-gold drop-shadow-[0_4px_30px_rgba(212,175,55,0.5)] md:text-7xl"
      >
        Happy Birthday, Kayla.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.6 }}
        className="mt-6 max-w-2xl text-center font-serif text-xl italic text-ivory/85 md:text-2xl"
      >
        The whole network is cheering for you. 🥂🎂
      </motion.p>

      <p className="mt-16 max-w-md text-center font-serif text-xs italic text-ivory/40">
        With love, from your friends and clients · curated by Hub Solutions Digital
      </p>
    </section>
  );
}
