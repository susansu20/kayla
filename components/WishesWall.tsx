"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2 } from "lucide-react";

type WishRow = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

type WishView = WishRow & {
  rotate: number;
  x: number;
  y: number;
  tint: "rose" | "gold" | "ivory";
};

const TINTS: Record<WishView["tint"], string> = {
  ivory: "bg-ivory text-midnight",
  rose: "bg-rose text-midnight",
  gold: "bg-gold-soft text-midnight",
};

/**
 * Deterministic scatter based on the wish's UUID, so positions stay stable
 * across renders + reloads. We only persist (id, name, message, created_at)
 * in the DB; everything visual is derived here.
 */
function scatter(id: string, index: number): Omit<WishView, keyof WishRow> {
  const h = parseInt(id.replace(/-/g, "").slice(0, 8), 16) || index * 9973;
  const tints: WishView["tint"][] = ["ivory", "rose", "gold"];
  return {
    x: 6 + (h % 80), // 6%..86%
    y: 6 + ((h >> 8) % 70), // 6%..76%
    rotate: ((h >> 16) % 12) - 6, // -6deg..+5deg
    tint: tints[index % tints.length],
  };
}

export default function WishesWall() {
  const [wishes, setWishes] = useState<WishRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/wishes", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (alive) setWishes(d.wishes ?? []);
      })
      .catch(() => {
        /* swallow — empty wall is fine */
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const views: WishView[] = useMemo(
    () => wishes.map((w, i) => ({ ...w, ...scatter(w.id, i) })),
    [wishes]
  );

  const submit = async () => {
    if (!name.trim() || !message.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      const data = await res.json();
      if (!res.ok || !data.wish) {
        setError("Something went wrong — please try again.");
        return;
      }
      // Newest first
      setWishes((w) => [data.wish, ...w]);
      setName("");
      setMessage("");
      setOpen(false);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="relative z-10 min-h-[110svh] w-full bg-gradient-to-b from-midnight to-midnight-2 py-24"
      aria-label="Wishes wall"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-gold/80">Act V</p>
        <h2 className="mt-4 font-serif text-4xl md:text-6xl">A wall of wishes.</h2>
        <p className="mt-4 font-serif italic text-ivory/70">
          Drag them around. Pin a new one to the wall.
        </p>
      </div>

      <div className="relative mx-auto mt-12 h-[100vh] max-h-[820px] w-[92%] max-w-6xl rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_70%)] ring-1 ring-gold/15">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-gold/70">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {!loading && views.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
            <p className="font-serif text-2xl italic text-ivory/70">
              The wall is empty — be the first to pin a wish.
            </p>
          </div>
        )}

        {views.map((w) => (
          <motion.div
            key={w.id}
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.04, zIndex: 50 }}
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`absolute w-[240px] cursor-grab select-none rounded-md p-4 shadow-[0_18px_40px_-10px_rgba(0,0,0,0.7)] active:cursor-grabbing md:w-[260px] ${TINTS[w.tint]}`}
            style={{
              left: `${w.x}%`,
              top: `${w.y}%`,
              rotate: `${w.rotate}deg`,
            }}
          >
            <p className="font-serif italic leading-snug">"{w.message}"</p>
            <p className="mt-3 text-xs uppercase tracking-[0.25em] opacity-70">
              — {w.name}
            </p>
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
            onClick={() => !submitting && setOpen(false)}
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
                disabled={submitting}
                className="absolute right-4 top-4 rounded-full p-1 text-midnight/60 hover:bg-midnight/10 disabled:opacity-40"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="font-serif text-2xl">Leave a wish for Kayla</h3>
              <label className="mt-6 block text-xs uppercase tracking-[0.3em] text-midnight/60">
                From
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  maxLength={80}
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
                  maxLength={280}
                  className="mt-2 w-full resize-none rounded-md border border-midnight/20 bg-transparent px-3 py-2 font-sans normal-case tracking-normal text-midnight focus:border-gold focus:outline-none"
                />
              </label>
              {error && (
                <p className="mt-3 text-xs text-red-600">{error}</p>
              )}
              <button
                onClick={submit}
                disabled={!name.trim() || !message.trim() || submitting}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-midnight px-6 py-3 text-sm uppercase tracking-[0.3em] text-ivory transition hover:bg-midnight-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Pinning…" : "Pin it"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
