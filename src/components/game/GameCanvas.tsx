"use client";

import dynamic from 'next/dynamic';


// Tạo một component wrapper sẽ chỉ render ở client
const GameCanvasClient = dynamic(() => import('@/components/game/GameCanvasClient'), {
  ssr: false
});

export default function GameCanvas() {

  return (
    <div className="relative w-full">
      <div
        id="game-container"
        className="w-full border border-gray-700"
        suppressHydrationWarning
      />
      <GameCanvasClient />
    </div>
  );
}
