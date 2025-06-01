"use client";

import { useCurrentAccount, useSignTransaction } from '@mysten/dapp-kit';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';


// Tạo một component wrapper sẽ chỉ render ở client
const PvpCanvasClient = dynamic(() => import('@/components/game/PvpCanvasClient'), {
  ssr: false
});

export default function PvpCanvas() {
  // Lấy battleId từ URL path
  const params = useParams();
  const battleId = params?.id as string;

  // Lấy role từ query parameters
  const searchParams = useSearchParams();
  const role = parseInt(searchParams.get('role') || '0', 10);

  const currentAccount = useCurrentAccount();
  const { mutateAsync: signTransaction } = useSignTransaction();
  const [battleStateId, setBattleStateId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Log để debug
  useEffect(() => {
    console.log("Battle ID from URL:", battleId);
    console.log("Role from query:", role);
  }, [battleId, role]);

  useEffect(() => {
    async function callContract() {
      if (!currentAccount || !signTransaction) {
        alert(`Please connect your wallet to start the battle.`);
        return;
      }

      if (!battleId) {
        console.error("No battle ID found in URL");
        return;
      }

      // Set battleId từ URL
      setBattleStateId(battleId);
      setIsLoading(false);
    }

    callContract();
  }, [battleId, currentAccount, signTransaction]);

  return (
    <div className="relative w-full">
      <div
        id="game-container"
        className="w-full border border-gray-700"
        suppressHydrationWarning
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-yellow-400 font-orbitron text-xl">Loading Battle...</p>
          <p className="text-gray-400 text-sm mt-2">Connecting to blockchain, please wait</p>
        </div>
      ) : battleStateId ? (
        <PvpCanvasClient
          battleStateId={battleStateId}
          playerRole={role}
        />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
          <p className="text-red-400 font-orbitron text-xl">Failed to load battle data</p>
          <p className="text-gray-400 text-sm mt-2">Battle ID not found or invalid</p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Return to Home
          </button>
        </div>
      )}
    </div>
  );
}
