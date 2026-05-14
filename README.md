# Kayla Wong — Birthday Tribute Landing Page

A single-page, cinematic birthday tribute built for **Kayla Wong** — 3× Rising
Millionaire at PropNex, Associate Division Director of the Kayla Wong Division,
featured on EdgeProp.

Built with Next.js 14 (App Router), TypeScript, Tailwind, Framer Motion, GSAP +
ScrollTrigger, canvas-confetti, and Howler.

## Quick start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Customise

### 1. Audio

Drop a royalty-free instrumental at `public/audio/birthday-loop.mp3`.
Recommended:

- Bensound — *Memories* or *Tenderness* (https://www.bensound.com)
- Pixabay Music — search *Birthday Celebration*

The track starts at 35% volume on the first user click (curtain open) and loops.
The floating mute pill (bottom-right) toggles it.

### 2. Photos

Five photos live in `public/kayla/`. Replace any of them with a same-named
file — the layout will pick up the new image automatically:

```
public/kayla/01-rising-millionaire.jpg
public/kayla/02-top-200-achievers.jpg
public/kayla/03-marina-view.jpg
public/kayla/04-emerald-katong.jpg
public/kayla/05-library.jpg
```

To change positions/rotations, edit the `CARDS` array in
`components/PhotoMosaic.tsx`.

### 3. Wishes wall

Placeholder wishes are seeded in `SEED_WISHES` inside
`components/WishesWall.tsx`. Replace each `from` + `message` with real ones
from her network. The on-page "+ Add a wish" button writes to local state only
(demo); wire it to your DB of choice (Supabase, Firestore, etc.) to persist.

### 4. Achievements copy

Edit the `ACCOLADES` array in `components/AchievementsStage.tsx`.

### 5. OG image

Drop a card image at `public/og.png` (recommended 1200×630, gold-on-navy).

## Deploy

```bash
npx vercel
```

That's it.

## File map

```
/app
  /page.tsx              orchestrates all acts
  /layout.tsx            fonts, metadata, OG tags
  /globals.css           tailwind base + film grain + spotlight helpers
/components
  /Curtain.tsx           Act 1 — velvet curtain entry gate
  /PhotoMosaic.tsx       Act 2 — photos zoom in + hero name
  /AchievementsStage.tsx Act 3 — horizontal-scroll spotlight panels
  /BirthdayToast.tsx     Act 4 — champagne flutes that fill on scroll
  /WishesWall.tsx        Act 5 — draggable polaroid wishes + add modal
  /Finale.tsx            Act 6 — fireworks + share buttons
  /AudioPlayer.tsx       floating mute pill
  /CustomCursor.tsx      soft gold cursor glow (desktop only)
  /ParticleBackground.tsx soft gold particle drift
/lib
  /audio.ts              Howler singleton
  /confetti.ts           curtainBurst + startFireworks
/public
  /audio/                drop birthday-loop.mp3 here
  /kayla/                5 hero photos
```
