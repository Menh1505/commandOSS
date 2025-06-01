'use client'

import { useEffect, useState } from "react";
import * as Phaser from "phaser";
import HP from './HP';
import SkillPanel from './SkillPanel';
import { Skill } from '@/types/skill.type';
import suiService from "@/services/sui.services";
import { useSignTransaction } from "@mysten/dapp-kit";
import { motion } from "framer-motion";

interface GameCanvasClientProps {
    battleStateId: string | null;
    playerRole: number;
}

interface BattleState {
    hp1: number;
    hp2: number;
    result: string;
    turn: number;
}

export default function GameCanvasClient({ battleStateId, playerRole }: GameCanvasClientProps) {
    const [gameDimensions, setGameDimensions] = useState({ width: 0, height: 0 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [game, setGame] = useState<Phaser.Game | null>(null);
    const { mutateAsync: signTransaction } = useSignTransaction();
    const [battleState, setBattleState] = useState<BattleState>();
    const [isActionInProgress, setIsActionInProgress] = useState(false);
    const [showResult, setShowResult] = useState(false);

    // Hàm lấy trạng thái battle từ blockchain
    async function fetchBattleState() {
        if (!battleStateId) return;

        try {
            const state = await suiService.getBattleState(battleStateId) as unknown as BattleState;
            console.log("Updated battle state:", state);
            setBattleState(state);

            // Nếu trận đấu đã kết thúc, hiển thị kết quả
            if (state && state.result) {
                setShowResult(true);
            }

            return state;
        } catch (error) {
            console.error("Error fetching battle state:", error);
        }
    }

    // Lấy trạng thái battle ban đầu khi component được mount
    useEffect(() => {
        if (!battleStateId) {
            console.error("Battle state ID is required to start the game.");
            return;
        }

        // Lấy trạng thái ban đầu sau một độ trễ ngắn
        setTimeout(() => {
            fetchBattleState();
        }, 2000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [battleStateId]);

    useEffect(() => {
        const container = document.getElementById('game-container');
        if (!container) return;
        container.innerHTML = '';

        const calculateDimensions = () => {
            const width = container.clientWidth;
            const height = window.innerHeight - 20;
            return { width, height };
        };

        const { width, height } = calculateDimensions();
        setGameDimensions({ width, height });

        container.style.height = `${height}px`;

        class MainScene extends Phaser.Scene {
            constructor() {
                super("MainScene");
            }

            preload() {
                this.load.image('background', '/maps/twillight-forest.png');

                this.load.spritesheet('player',
                    '/sheet/Woodcutter/Woodcutter_idle.png',
                    {
                        frameWidth: 48,
                        frameHeight: 48
                    }
                );
                this.load.spritesheet('enemy',
                    '/sheet/SteamMan/SteamMan_idle.png',
                    {
                        frameWidth: 48,
                        frameHeight: 48
                    }
                );
            }

            create() {
                const bg = this.add.image(0, 0, 'background');
                bg.setOrigin(0, 0);
                bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

                const playerX = this.cameras.main.width * 0.25;
                const enemyX = this.cameras.main.width * 0.75;
                const characterY = this.cameras.main.height * 0.7;

                const autoScale = Math.max(3, Math.min(5, this.cameras.main.height / 240));

                const player = this.add.sprite(playerX, characterY, 'player', 0).setScale(autoScale);
                const enemy = this.add.sprite(enemyX, characterY, 'enemy', 0).setScale(autoScale);
                enemy.flipX = true;

                this.anims.create({
                    key: 'enemy_idle',
                    frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
                    frameRate: 8,
                    repeat: -1
                });

                this.anims.create({
                    key: 'idle',
                    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
                    frameRate: 8,
                    repeat: -1
                });

                player.play('idle');
                enemy.play('enemy_idle');
            }
        }

        const gameInstance = new Phaser.Game({
            type: Phaser.AUTO,
            width: width,
            height: height,
            backgroundColor: "#111827",
            parent: 'game-container',
            scene: [MainScene],
            scale: {
                mode: Phaser.Scale.RESIZE,
                width: width,
                height: height,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        });

        setGame(gameInstance);

        const handleResize = () => {
            const { width: newWidth, height: newHeight } = calculateDimensions();

            if (gameInstance) {
                gameInstance.scale.resize(newWidth, newHeight);
                setGameDimensions({ width: newWidth, height: newHeight });
            }

            container.style.height = `${newHeight}px`;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (gameInstance) gameInstance.destroy(true);
        };
    }, []);

    const useSkill = async (skill: Skill) => {
        if (!battleStateId || isActionInProgress) return;

        try {
            setIsActionInProgress(true);
            console.log("Using skill:", skill);

            // Gọi hàm attack
            const resAttack = await suiService.attack(
                battleStateId,
                signTransaction,
            );
            console.log("Attack result:", resAttack);

            // Chờ một chút để giao dịch được xác nhận trên blockchain
            setTimeout(async () => {
                // Sau khi tấn công, cập nhật lại trạng thái battle
                const updatedState = await fetchBattleState();

                // Kiểm tra kết quả trận đấu
                if (updatedState && updatedState.result) {
                    setShowResult(true);
                }

                setIsActionInProgress(false);
            }, 2000); // Đợi 2 giây cho giao dịch được xác nhận

        } catch (error) {
            console.error("Error using skill:", error);
            setIsActionInProgress(false);
        }
    };

    // Xác định người thắng dựa trên kết quả và vai trò
    const determineWinner = () => {
        if (!battleState || !battleState.result) return null;

        // Giả sử kết quả là "player1_win" hoặc "player2_win"
        if (battleState.result === "player1_win") {
            return playerRole === 1 ? "You Win!" : "You Lose!";
        } else if (battleState.result === "player2_win") {
            return playerRole === 2 ? "You Win!" : "You Lose!";
        } else if (battleState.result === "draw") {
            return "Draw!";
        }

        return null;
    };

    // Xác định màu sắc dựa vào kết quả
    const getResultColor = () => {
        if (!battleState || !battleState.result) return "text-white";

        const result = determineWinner();
        if (result === "You Win!") return "text-green-500";
        if (result === "You Lose!") return "text-red-500";
        return "text-yellow-400"; // Draw
    };

    const uiScale = Math.min(
        Math.max(gameDimensions.width / 1000, 0.7),
        1.4
    );

    return (
        <>
            {/* Battle Result Overlay */}
            {showResult && battleState?.result && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                        className="bg-gray-800 bg-opacity-90 rounded-lg p-8 shadow-2xl border border-gray-700 max-w-md w-full mx-4"
                    >
                        <h2 className={`text-4xl font-orbitron font-bold mb-6 text-center ${getResultColor()}`}>
                            {determineWinner()}
                        </h2>

                        <div className="flex justify-between items-center mb-6">
                            <div className="text-center">
                                <div className="text-gray-400 text-sm">Player 1</div>
                                <div className="text-2xl font-bold text-yellow-400">{battleState.hp1}</div>
                                <div className="text-xs text-gray-400">HP</div>
                            </div>

                            <div className="text-2xl font-bold">VS</div>

                            <div className="text-center">
                                <div className="text-gray-400 text-sm">Player 2</div>
                                <div className="text-2xl font-bold text-purple-400">{battleState.hp2}</div>
                                <div className="text-xs text-gray-400">HP</div>
                            </div>
                        </div>

                        <div className="text-center text-sm text-gray-400 mb-6">
                            Battle completed after {battleState.turn} turns
                        </div>

                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => window.location.href = '/pvp/create'}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors font-orbitron"
                            >
                                New Battle
                            </button>

                            <button
                                onClick={() => window.location.href = '/'}
                                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors font-orbitron"
                            >
                                Return Home
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Game Controls - Giữ nguyên code hiện tại */}
            <div
                className="absolute z-10"
                style={{
                    bottom: '5%',
                    left: '50%',
                    transform: `translate(-50%, 0) scale(${uiScale})`
                }}
            >
                <div className="w-full max-w-md px-4">
                    <SkillPanel
                        onClick={useSkill}
                        disabled={isActionInProgress || showResult} // Cũng disable khi đã có kết quả
                    />
                    {isActionInProgress && (
                        <div className="mt-2 text-center text-yellow-400 font-orbitron text-sm">
                            Processing action...
                        </div>
                    )}
                </div>
            </div>

            <div
                className="absolute z-10 left-2"
                style={{
                    bottom: '5%',
                    transform: `scale(${uiScale})`,
                    transformOrigin: 'bottom left'
                }}
            >
                <div className="w-full max-w-md px-2">
                    <HP
                        name={"You"}
                        hp={playerRole === 1 ? (battleState?.hp1 ?? 0) : (battleState?.hp2 ?? 0)}
                        maxHp={100}
                        avatarUrl={"/avatars/notion.png"}
                    />
                </div>
            </div>

            <div
                className="absolute z-10 right-2"
                style={{
                    bottom: '5%',
                    transform: `scale(${uiScale})`,
                    transformOrigin: 'bottom right'
                }}
            >
                <div className="w-full max-w-md px-2">
                    <HP
                        name={"Enemy"}
                        hp={playerRole === 1 ? (battleState?.hp2 ?? 0) : (battleState?.hp1 ?? 0)}
                        maxHp={80}
                        avatarUrl={"/avatars/orc.jpg"}
                    />
                </div>
            </div>
        </>
    );
}