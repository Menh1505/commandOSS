"use client";

import { useEffect, useState } from 'react';
import { useCurrentAccount, useSignTransaction } from '@mysten/dapp-kit';
import suiService from '@/services/sui.services';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface PvPRoomState {
    room_master: string,
    player_number: number,
    hp1: number,
    hp2: number,
    atk1: number,
    atk2: number,
    def1: number,
    def2: number,
    turn: number, // 0: waiting, 1: player1, 2: player2
    result: number, // 0: playing, 1: player1 win, 2: player2 win
}

export default function CreatePvPRoom() {
    const router = useRouter();
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signTransaction } = useSignTransaction();
    const [roomId, setRoomId] = useState<string | null>(null);
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [roomStatus, setRoomStatus] = useState<'waiting' | 'ready' | 'error'>('waiting');

    // Tạo phòng PvP khi component mount
    useEffect(() => {
        async function createPvPRoom() {
            if (!currentAccount?.address) {
                return;
            }
            try {
                setIsCreatingRoom(true);

                // Gọi service để tạo phòng PvP
                const createdRoomId = await suiService.createPvpBattle(signTransaction, currentAccount);

                if (!createdRoomId) {
                    throw new Error("Failed to create PvP room");
                }

                console.log("Created PvP Room with ID:", createdRoomId);
                setRoomId(createdRoomId);
                startRoomPolling(createdRoomId);

            } catch (err) {
                if (err instanceof Error) {
                    console.error("Error creating PvP room:", err);
                    setRoomStatus('waiting');
                }
            } finally {
                setIsCreatingRoom(false);
            }
        }

        createPvPRoom();
    }, [currentAccount, signTransaction]);

    // Kiểm tra trạng thái phòng định kỳ
    const startRoomPolling = (roomId: string) => {
        const checkRoomInterval = setInterval(async () => {
            try {
                const roomState = await suiService.getPvpRoomState(roomId) as unknown as PvPRoomState;
                console.log("Current Room State:", roomState);
                if (roomState.player_number == 2) {
                    setRoomStatus('ready');
                    clearInterval(checkRoomInterval);
                }
            } catch (err) {
                console.error("Error checking room status:", err);
            }
        }, 5000);

        return () => clearInterval(checkRoomInterval);
    };

    const handleStartGame = () => {
        if (roomId && roomStatus === 'ready') {
            router.push(`/pvp/?id=${roomId}&role=1`);
        }
    };

    const handleCopyRoomId = () => {
        if (roomId) {
            navigator.clipboard.writeText(roomId);
            alert("Room ID copied to clipboard!");
        }
    };

    return (
        <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
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

            <div className="text-center max-w-xl w-full mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600 inline-block">
                        PvP Battle Room
                    </h1>
                </div>

                {isCreatingRoom ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-purple-400 font-orbitron">Creating Battle Room...</p>
                    </div>
                ) : roomId ? (
                    <div className="space-y-6">
                        <div className="relative w-full h-32 mb-4">
                            <Image
                                src="/images/pvp-arena.jpg"
                                alt="PvP Arena"
                                fill
                                className="object-cover rounded-lg opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent" />
                        </div>

                        <div className="bg-gray-900 p-4 rounded-lg">
                            <h2 className="text-xl font-orbitron mb-2">Room Created!</h2>

                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-gray-700 px-3 py-2 rounded-lg font-mono text-yellow-300 flex-1 overflow-hidden overflow-ellipsis text-center">
                                    {roomId}
                                </div>
                                <button
                                    onClick={handleCopyRoomId}
                                    className="ml-2 bg-gray-700 hover:bg-gray-600 p-2 rounded-lg"
                                    title="Copy Room ID"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 mb-4">
                                <p className="text-blue-300">
                                    Share this Room ID with your opponent to start the battle!
                                </p>
                            </div>

                            <div className="flex justify-between items-center">

                                <div className="w-24 h-0 border-t-2 border-dashed border-gray-600 relative flex-1 mx-2">
                                    {roomStatus === 'waiting' ? (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 animate-pulse">
                                            <span className="text-yellow-500 animate-ping">⚔️</span>
                                        </div>
                                    ) : (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <span className="text-green-500">⚔️</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleStartGame}
                                disabled={roomStatus !== 'ready'}
                                className={`w-full py-4 rounded-lg font-orbitron text-lg shadow-lg transition-all ${roomStatus === 'ready'
                                    ? 'bg-green-600 hover:bg-green-700 transform hover:scale-105'
                                    : 'bg-gray-700 cursor-not-allowed opacity-70'
                                    }`}
                            >
                                {roomStatus === 'ready' ? 'Start Battle!' : 'Waiting for Opponent...'}
                            </button>

                            {roomStatus === 'waiting' && (
                                <p className="text-sm text-gray-400 mt-2 animate-pulse">
                                    Checking for opponent every 5 seconds...
                                </p>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </main>
    );
}