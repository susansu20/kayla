"use client";

import { useState } from "react";
import Curtain from "@/components/Curtain";
import ParticleBackground from "@/components/ParticleBackground";
import PhotoMosaic from "@/components/PhotoMosaic";
import AchievementsStage from "@/components/AchievementsStage";
import BirthdayToast from "@/components/BirthdayToast";
import WishesWall from "@/components/WishesWall";
import Finale from "@/components/Finale";
import AudioPlayer from "@/components/AudioPlayer";
import CustomCursor from "@/components/CustomCursor";

export default function Page() {
  const [opened, setOpened] = useState(false);

  return (
    <main className="relative film-grain">
      <ParticleBackground />
      <CustomCursor />
      <Curtain onOpen={() => setOpened(true)} />

      <PhotoMosaic start={opened} />
      <AchievementsStage />
      <BirthdayToast />
      <WishesWall />
      <Finale />

      <AudioPlayer show={opened} />
    </main>
  );
}
