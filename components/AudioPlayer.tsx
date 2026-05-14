"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { setMuted } from "@/lib/audio";

/**
 * Floating mute pill. Visible from Act 2 onward (once the curtain has opened).
 * Frosted glass with a gold border to match the palette.
 * Defaults to unmuted — the curtain click is the user gesture that lets the
 * audio engine start.
 */
export default function AudioPlayer({ show }: { show: boolean }) {
  const [muted, setMutedState] = useState(false);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={muted ? "Unmute background music" : "Mute background music"}
      className={`fixed bottom-6 right-6 z-[70] flex h-12 w-12 items-center justify-center rounded-full bg-midnight/40 text-gold ring-1 ring-gold/50 backdrop-blur-md transition-all duration-500 hover:bg-midnight/60 hover:ring-gold md:h-14 md:w-14 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </button>
  );
}
