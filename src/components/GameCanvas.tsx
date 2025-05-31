"use client";

import dynamic from 'next/dynamic';
import HP from './HP';

// Tạo một component wrapper sẽ chỉ render ở client
const GameCanvasClient = dynamic(() => import('@/components/GameCanvasClient'), {
  ssr: false
});

export default function GameCanvas() {
  // Sử dụng suppressHydrationWarning để loại bỏ cảnh báo hydration
  return (
    <>
      <div
        id="game-container"
        className="w-full border border-gray-700"
        suppressHydrationWarning
      />
      <GameCanvasClient />
      <div
        className="fixed z-10"
        style={{ bottom: '5%', left: '5%' }}
      >
        <div className="w-full max-w-md px-4">
          <HP name={"Player"} hp={100} maxHp={100} />
        </div>
      </div>

      <div
        className="fixed z-10"
        style={{ bottom: '5%', right: '5%' }}
      >
        <div className="w-full max-w-md px-4">
          <HP name={"Enemy"} hp={80} maxHp={100} />
        </div>
      </div>
    </>
  );
}
