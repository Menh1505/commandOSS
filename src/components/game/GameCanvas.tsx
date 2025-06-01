"use client";

import suiService from '@/services/sui.services';
import { useCurrentAccount, useSignTransaction } from '@mysten/dapp-kit';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';


// Tạo một component wrapper sẽ chỉ render ở client
const GameCanvasClient = dynamic(() => import('@/components/game/GameCanvasClient'), {
  ssr: false
});

export default function GameCanvas() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signTransaction } = useSignTransaction();
  const [battleStateId, setBattleStateId] = useState<string | null>(null);


  useEffect(() => {
    async function callContract() {
      if (!currentAccount || !signTransaction) {
        alert(`Please connect your wallet to start the battle.`);
        return;
      }
      const battleId = await suiService.createBattle(signTransaction, currentAccount)

      if (!battleId) {
        return;
      }
      setBattleStateId(battleId);

      setTimeout(async () => {
        try {
          const battleState = await suiService.getBattleState(battleId);
          console.log("Battle state after 3 seconds:", battleState);
        } catch (error) {
          console.error("Error fetching battle state:", error);
        }
      }, 3000);

    }
    callContract();
  }, [currentAccount, signTransaction]);
  return (
    <div className="relative w-full">
      <div
        id="game-container"
        className="w-full border border-gray-700"
        suppressHydrationWarning
      />
      {battleStateId ? (
        <GameCanvasClient />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-yellow-400 font-orbitron text-xl">Loading Battle...</p>
          <p className="text-gray-400 text-sm mt-2">Connecting to blockchain, please wait</p>
        </div>
      )}
    </div>
  );
}
