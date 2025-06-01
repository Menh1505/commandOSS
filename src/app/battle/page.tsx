'use client'

import GameCanvas from "@/components/game/GameCanvas";
import Link from "next/link";
import suiService from '@/services/sui.services';
import { useCurrentAccount, useSignTransaction } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

export default function BattlePage() {
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

    }
    callContract();
  }, [currentAccount, signTransaction]);


  return (
    <main>
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="inline-flex items-center px-3 py-2 bg-gray-900/70 backdrop-blur-sm rounded-lg text-yellow-400 hover:text-yellow-300 hover:bg-gray-800/80 transition-colors font-orbitron shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
      </div>
      {battleStateId ? (
        <GameCanvas />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-yellow-400 font-orbitron text-xl">Loading Battle...</p>
          <p className="text-gray-400 text-sm mt-2">Connecting to blockchain, please wait</p>
        </div>
      )}
    </main>
  );
}