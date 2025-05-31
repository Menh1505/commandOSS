import Link from "next/link";

export default function HeroesPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <Link 
        href="/"
        className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-8 font-orbitron"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold mb-8 font-orbitron">Heroes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mẫu nhân vật */}
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
          <div className="bg-gray-700 h-48 rounded-md mb-4 flex items-center justify-center">
            <div className="text-6xl">🪓</div>
          </div>
          <h3 className="font-orbitron text-xl mb-2">Woodcutter</h3>
          <p className="text-gray-400 mb-4">A skilled warrior with mastery of axe combat.</p>
          <button className="w-full bg-yellow-600 hover:bg-yellow-500 py-2 rounded font-orbitron">
            Select
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
          <div className="bg-gray-700 h-48 rounded-md mb-4 flex items-center justify-center">
            <div className="text-6xl">🤖</div>
          </div>
          <h3 className="font-orbitron text-xl mb-2">SteamMan</h3>
          <p className="text-gray-400 mb-4">Mechanical powerhouse with steam-powered attacks.</p>
          <button className="w-full bg-yellow-600 hover:bg-yellow-500 py-2 rounded font-orbitron">
            Select
          </button>
        </div>
      </div>
    </main>
  );
}