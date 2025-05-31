"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";

export default function GameCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    class MainScene extends Phaser.Scene {
      constructor() {
        super("MainScene");
      }

      preload() {
        // preload hình pixel 32x32 nếu bạn có
        this.load.image("hero", "/sprites/hero_idle_1.png");
      }

      create() {
        this.add.image(100, 100, "hero").setScale(2);
      }
    }

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: 400,
      height: 300,
      backgroundColor: "#111827", // Tailwind gray-900
      parent: "game-container",
      scene: [MainScene],
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="game-container" className="w-full max-w-md mx-auto mt-10 border border-gray-700" />;
}
