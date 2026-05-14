"use client";

/**
 * Web-Audio-synthesized "Happy Birthday" loop.
 *
 * Why not an MP3? The melody of Happy Birthday entered the public domain in
 * 2016, but every commercial *recording* is still copyrighted. Synthesizing
 * the melody ourselves sidesteps that and means the page works with zero
 * external files. Sound is a soft music-box / bell timbre (triangle + sine
 * harmonic, gentle ADSR envelope) at low volume so it stays ambient.
 *
 * Public API mirrors what Curtain/AudioPlayer already call:
 *   - playBgm()        start the loop (must be inside a user gesture)
 *   - setMuted(bool)   live mute / unmute
 *   - isMuted()        current state
 *
 * If you ever prefer a real recording, drop an MP3 at
 * /public/audio/birthday-loop.mp3 and we'll prefer it over the synth.
 */

// Frequencies in Hz (F major — warm, low register).
const F4 = 349.23;
const G4 = 392.0;
const A4 = 440.0;
const Bb4 = 466.16;
const C5 = 523.25;
const D5 = 587.33;
const Eb5 = 622.25;
const F5 = 698.46;

type Note = [freq: number, beats: number];

// Happy Birthday — one full pass. Beats are relative; tempo set below.
const MELODY: Note[] = [
  // "Hap-py birth-day to you"
  [F4, 0.75], [F4, 0.25], [G4, 1], [F4, 1], [Bb4, 1], [A4, 2],
  [0, 0.5], // breath
  // "Hap-py birth-day to you"
  [F4, 0.75], [F4, 0.25], [G4, 1], [F4, 1], [C5, 1], [Bb4, 2],
  [0, 0.5],
  // "Hap-py birth-day dear Kayla"
  [F4, 0.75], [F4, 0.25], [F5, 1], [D5, 1], [Bb4, 1], [A4, 1], [G4, 1],
  [0, 0.5],
  // "Hap-py birth-day to you"
  [Eb5, 0.75], [Eb5, 0.25], [D5, 1], [Bb4, 1], [C5, 1], [Bb4, 2.5],
];

const BPM = 96;
const BEAT = 60 / BPM;
const GAP_BETWEEN_LOOPS_SEC = 3;
const VOLUME = 0.18;

type State = {
  ctx: AudioContext | null;
  master: GainNode | null;
  muted: boolean;
  running: boolean;
  loopTimeout: ReturnType<typeof setTimeout> | null;
  htmlAudio: HTMLAudioElement | null;
  usingMp3: boolean;
};

const state: State = {
  ctx: null,
  master: null,
  muted: false,
  running: false,
  loopTimeout: null,
  htmlAudio: null,
  usingMp3: false,
};

/** Try to use a real MP3 at /audio/birthday-loop.mp3; fall back to synth. */
function tryMp3(): boolean {
  if (typeof window === "undefined") return false;
  if (state.htmlAudio) return state.usingMp3;
  const audio = new Audio("/audio/birthday-loop.mp3");
  audio.loop = true;
  audio.volume = 0.35;
  audio.preload = "auto";
  // The file is optional — if it 404s we never use this element.
  audio.addEventListener("error", () => {
    state.usingMp3 = false;
  });
  state.htmlAudio = audio;
  return false; // unknown until network resolves; synth starts immediately
}

function getCtx(): AudioContext | null {
  if (state.ctx) return state.ctx;
  if (typeof window === "undefined") return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  state.ctx = new Ctx();
  state.master = state.ctx.createGain();
  state.master.gain.value = state.muted ? 0 : VOLUME;
  state.master.connect(state.ctx.destination);
  return state.ctx;
}

/** Schedule a single note with a soft bell envelope. */
function playNote(startTime: number, freq: number, durationSec: number) {
  const ctx = state.ctx;
  const master = state.master;
  if (!ctx || !master) return;
  if (freq === 0) return; // rest

  const env = ctx.createGain();
  env.connect(master);
  env.gain.setValueAtTime(0.0001, startTime);
  env.gain.exponentialRampToValueAtTime(1, startTime + 0.015);
  env.gain.exponentialRampToValueAtTime(
    0.0001,
    startTime + Math.max(0.1, durationSec * 0.95)
  );

  // Fundamental — triangle wave for warmth
  const o1 = ctx.createOscillator();
  o1.type = "triangle";
  o1.frequency.value = freq;
  o1.connect(env);
  o1.start(startTime);
  o1.stop(startTime + durationSec + 0.05);

  // Octave harmonic — sine wave, much quieter, gives a music-box shimmer
  const harmGain = ctx.createGain();
  harmGain.gain.value = 0.18;
  harmGain.connect(env);
  const o2 = ctx.createOscillator();
  o2.type = "sine";
  o2.frequency.value = freq * 2;
  o2.connect(harmGain);
  o2.start(startTime);
  o2.stop(startTime + durationSec + 0.05);
}

function scheduleOnePass() {
  const ctx = state.ctx;
  if (!ctx || !state.running) return;
  let t = ctx.currentTime + 0.1;
  for (const [freq, beats] of MELODY) {
    const dur = beats * BEAT;
    playNote(t, freq, dur);
    t += dur;
  }
  const totalMs = (t - ctx.currentTime + GAP_BETWEEN_LOOPS_SEC) * 1000;
  state.loopTimeout = setTimeout(() => {
    if (state.running) scheduleOnePass();
  }, totalMs);
}

export function playBgm() {
  if (state.running) return;
  state.running = true;

  // Best-effort: try MP3 first. If the user has dropped a file, prefer it.
  tryMp3();
  if (state.htmlAudio) {
    state.htmlAudio
      .play()
      .then(() => {
        state.usingMp3 = true;
        // If MP3 plays, don't also play the synth.
      })
      .catch(() => {
        state.usingMp3 = false;
      });
  }

  // Start the synth regardless — if the MP3 ends up playing, we'll mute synth.
  const ctx = getCtx();
  if (!ctx) return;
  // Some browsers create the context suspended until a user gesture resumes it.
  if (ctx.state === "suspended") ctx.resume().catch(() => {});

  // If MP3 starts playing later, silence the synth via master gain.
  // We poll briefly to detect that.
  setTimeout(() => {
    if (state.usingMp3 && state.master) {
      state.master.gain.value = 0;
    }
  }, 800);

  scheduleOnePass();
}

export function setMuted(muted: boolean) {
  state.muted = muted;
  if (state.master) state.master.gain.value = muted ? 0 : VOLUME;
  if (state.htmlAudio) state.htmlAudio.muted = muted;
}

export function isMuted() {
  return state.muted;
}
