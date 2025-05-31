export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
                <h2 className="text-xl font-orbitron">Loading...</h2>
            </div>
        </div>
    );
}