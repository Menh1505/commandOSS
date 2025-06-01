'use client'

import GameCanvas from "@/components/game/GameCanvas";
import Link from "next/link";

export default function BattlePage() {
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
      <GameCanvas />
    </main>
  );
}