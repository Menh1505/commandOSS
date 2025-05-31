import GameCanvas from "@/components/game/GameCanvas";
import Link from "next/link";

export default function BattlePage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-4">
        <Link 
          href="/"
          className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4 font-orbitron"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl px-4">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}> {/* Tỷ lệ 16:9 */}
            <div className="absolute inset-0">
              <GameCanvas />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}