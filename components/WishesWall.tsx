"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";

type Wish = {
  id: string;
  from: string;
  message: string;
  rotate: number;
  // Initial scatter position (percent of container)
  x: number;
  y: number;
  tint: "rose" | "gold" | "ivory";
};

// TODO: replace these placeholder wishes with real ones from Kayla's network.
const SEED_WISHES: Wish[] = [
  {
    id: "w1",
    from: "Marcus, PropNex",
    message:
      "Three Rising Millionaire years in a row — and the best one is always next year. Happy birthday, Kayla 🥂",
    rotate: -4,
    x: 8,
    y: 12,
    tint: "ivory",
  },
  {
    id: "w2",
    from: "A grateful buyer",
    message:
      "You saw the unit I almost walked past. Now it's home. Thank you for catching what I missed.",
    rotate: 3,
    x: 38,
    y: 6,
    tint: "rose",
  },
  {
    id: "w3",
    from: "Your KW Division",
    message:
      "To the boss who leads with precision and celebrates with us — here's to more wins together. 🎂",
    rotate: -2,
    x: 68,
    y: 14,
    tint: "gold",
  },
  {
    id: "w4",
    from: "BNI Chapter",
    message:
      "Elite member, even better human. Wishing you a year as remarkable as your referral count.",
    rotate: 5,
    x: 16,
    y: 50,
    tint: "rose",
  },
  {
    id: "w5",
    from: "An EdgeProp reader",
    message:
      '"Precision into a property buyer\'s superpower" — best line of the year. Happy birthday!',
    rotate: -3,
    x: 48,
    y: 54,
    tint: "ivory",
  },
  {
    id: "w6",
    from: "Hub Solutions Digital",
    message:
      "From your friends behind the scenes — happy birthday, Kayla. Keep being the standard.",
    rotate: 4,
    x: 72,
    y: 50,
    tint: "gold",
  },
];

const TINTS: Record<Wish["tint"], string> = {
  ivory: "bg-ivory text-midnight",
  rose: "bg-rose text-midnight",
  gold: "bg-gold-soft text-midnight",
};

export default function WishesWall() {
  const [wishes, setWishes] = useState<Wish[]>(SEED_WISHES);
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");

  const addWish = () => {
    if (!from.trim() || !message.trim()) return;
    const id = `w${Date.now()}`;
    const tints: Wish["tint"][] = ["ivory", "rose", "gold"];
    setWishes((w) => [
      ...w,
      {
        id,
        from: from.trim(),
        message: message.trim(),
        rotate: Math.random() * 12 - 6,
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 50,
        tint: tints[Math.floor(Math.random() * tints.length)],
      },
    ]);
    setFrom("");
    setMessage("");
    setOpen(false);
  };

  return (
    <section
      className="relative z-10 min-h-[110svh] w-full bg-gradient-to-b from-midnight to-midnight-2 py-24"
      aria-label="Wishes wall"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-gold/80">Act V</p>
        <h2 className="mt-4 font-serif text-4xl md:text-6xl">
          A wall of wishes.
        </h2>
        <p className="mt-4 font-serif italic text-ivory/70">
          Drag them around. Pin a new one to the wall.
        </p>
      </div>

      {/* Wishes board */}
      <div className="relative mx-auto mt-12 h-[100vh] max-h-[820px] w-[92%] max-w-6xl rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_70%)] ring-1 ring-gold/15">
        {wishes.map((w) => (
          <motion.div
            key={w.id}
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.04, zIndex: 50 }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`absolute w-[240px] cursor-grab select-none rounded-md p-4 shadow-[0_18px_40px_-10px_rgba(0,0,0,0.7)] active:cursor-grabbing md:w-[260px] ${TINTS[w.tint]}`}
            style={{
              left: `${w.x}%`,
              top: `${w.y}%`,
              rotate: `${w.rotate}deg`,
            }}
          >
            <p className="font-serif italic leading-snug">"{w.message}"</p>
            <p className="mt-3 text-xs uppercase tracking-[0.25em] opacity-70">
              — {w.from}
            </p>
            {/* Tape */}
            <span className="absolute -top-3 left-1/2 h-5 w-16 -translate-x-1/2 rounded-sm bg-ivory/40 backdrop-blur" />
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium uppercase tracking-[0.3em] text-midnight shadow-gold transition hover:shadow-gold-lg"
        >
          <Plus className="h-4 w-4" /> Add a wish
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-midnight/80 backdrop-blur"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[90%] max-w-md rounded-2xl bg-ivory p-8 text-midnight shadow-2xl"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 rounded-full p-1 text-midnight/60 hover:bg-midnight/10"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="font-serif text-2xl">Leave a wish for Kayla</h3>
              <label className="mt-6 block text-xs uppercase tracking-[0.3em] text-midnight/60">
                From
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Your name"
                  className="mt-2 w-full rounded-md border border-midnight/20 bg-transparent px-3 py-2 font-sans normal-case tracking-normal text-midnight focus:border-gold focus:outline-none"
                />
              </label>
              <label className="mt-4 block text-xs uppercase tracking-[0.3em] text-midnight/60">
                Message
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Write something kind…"
                  className="mt-2 w-full resize-none rounded-md border border-midnight/20 bg-transparent px-3 py-2 font-sans normal-case tracking-normal text-midnight focus:border-gold focus:outline-none"
                />
              </label>
              <button
                onClick={addWish}
                disabled={!from.trim() || !message.trim()}
                className="mt-6 w-full rounded-full bg-midnight px-6 py-3 text-sm uppercase tracking-[0.3em] text-ivory transition hover:bg-midnight-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Pin it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
