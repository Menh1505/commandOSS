"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@mysten/dapp-kit';
import { useCurrentAccount } from '@mysten/dapp-kit';
import router from 'next/router';
import { useState } from 'react';


export default function Home() {
  const currentAccount = useCurrentAccount();
  const isConnected = !!currentAccount;
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [roomId, setRoomId] = useState('');

  // Xử lý khi người dùng muốn tham gia phòng
  const handleJoinRoom = () => {
    console.log('Joining room with ID:', roomId);
    if (!roomId.trim()) {
      alert('Please enter a valid Room ID');
      return;
    }
    // Chuyển hướng đến trang phòng với ID đã nhập
    router.push(`/pvp/${roomId}`);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      {isConnected && (
        <div className="absolute top-4 right-4">
          <ConnectButton />
        </div>
      )}

      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-600">
          ⚔️ CommandOSS
        </h1>

        <p className="text-xl mb-8 text-gray-300">
          Enter the arena, embrace the battle, and command your destiny.
        </p>

        <div className="relative w-full h-64 mb-8">
          <Image
            src="/maps/twillight-forest.png"
            alt="Game Preview"
            fill
            className="object-cover rounded-lg shadow-2xl opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        </div>

        {/* Menu hiển thị tùy thuộc vào trạng thái đăng nhập */}
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
          {isConnected ? (
            <>
              {/* Menu khi đã kết nối ví */}
              <Link
                href="/battle"
                className="bg-red-600 hover:bg-red-700 text-white py-4 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 font-orbitron text-xl flex items-center justify-center"
              >
                <span className="mr-2">⚔️</span> Start PvE Battle
              </Link>
              <Link
                href="/pvp/create"
                className="bg-purple-600 hover:bg-purple-700 text-white py-4 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 font-orbitron text-xl flex items-center justify-center"
              >
                <span className="mr-2">🏆</span> Create PvP Room
              </Link>
              {isJoiningRoom ? (
                <div className="bg-gray-800 p-4 rounded-lg flex flex-col gap-3">
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter Room ID"
                    className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 font-orbitron"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleJoinRoom}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-orbitron"
                    >
                      Join
                    </button>
                    <button
                      onClick={() => setIsJoiningRoom(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-orbitron"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsJoiningRoom(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg shadow-lg transition-all hover:scale-105 font-orbitron flex items-center justify-center"
                >
                  <span className="mr-2">🔍</span> Join Room by ID
                </button>
              )}
              <Link
                href="/heroes"
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-8 rounded-lg shadow-lg transition-all hover:scale-105 font-orbitron"
              >
                Heroes
              </Link>

              <Link
                href="/settings"
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-8 rounded-lg shadow-lg transition-all hover:scale-105 font-orbitron"
              >
                Settings
              </Link>
            </>
          ) : (
            /* Hiển thị nút Connect lớn ở chính giữa khi chưa kết nối */
            <div className="flex flex-col items-center">
              <p className="text-lg mb-4 text-gray-400">Connect your wallet to start playing</p>
              <div className="scale-125 mb-2 transform-gpu">
                <ConnectButton />
              </div>
              <p className="text-sm mt-4 text-gray-500">
                Connect with Sui Wallet to access game features
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}