import GameCanvas from "@/components/GameCanvas";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">⚔️ CommandOSS COMBAT</h1>
      <GameCanvas />
    </main>
  );
}
