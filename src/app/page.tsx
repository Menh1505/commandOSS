import GameCanvas from "@/components/GameCanvas";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl">
        <GameCanvas />
      </div>
    </main>
  );
}
