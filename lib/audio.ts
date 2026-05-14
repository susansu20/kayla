"use client";

import { Howl } from "howler";

let bgm: Howl | null = null;

export function getBgm(): Howl {
  if (!bgm) {
    bgm = new Howl({
      src: ["/audio/birthday-loop.mp3"],
      loop: true,
      volume: 0.35,
      html5: true,
      // Fail silently if the placeholder file isn't present yet.
      onloaderror: () => {
        // eslint-disable-next-line no-console
        console.warn(
          "[audio] /audio/birthday-loop.mp3 not found. Drop a royalty-free track in /public/audio/."
        );
      },
    });
  }
  return bgm;
}

export function playBgm() {
  const h = getBgm();
  if (!h.playing()) h.play();
}

export function setMuted(muted: boolean) {
  getBgm().mute(muted);
}

export function isPlaying() {
  return !!bgm?.playing();
}
