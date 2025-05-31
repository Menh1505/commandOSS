import Link from "next/link";

export default function SettingsPage() {
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
      
      <h1 className="text-3xl font-bold mb-8 font-orbitron">Settings</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-xl">
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-orbitron">Music Volume</label>
          <input type="range" className="w-full" min="0" max="100" defaultValue="80" />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-orbitron">Sound Effects</label>
          <input type="range" className="w-full" min="0" max="100" defaultValue="100" />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-orbitron">Difficulty</label>
          <select className="w-full bg-gray-700 py-2 px-3 rounded text-white">
            <option>Easy</option>
            <option>Normal</option>
            <option>Hard</option>
          </select>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded font-orbitron">
          Save Settings
        </button>
      </div>
    </main>
  );
}