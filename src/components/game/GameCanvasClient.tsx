import { useEffect, useState } from "react";
import * as Phaser from "phaser";
import HP from './HP';
import SkillPanel from './SkillPanel';
import { Skill } from '@/types/skill.type';
import suiService from "@/services/sui.services";
import { useSignTransaction } from "@mysten/dapp-kit";

interface GameCanvasClientProps {
    battleStateId: string | null;
}

interface BattleState {
    player_hp: number;
    bot_hp: number;
    result: string;
    turn: number;
}

export default function GameCanvasClient({ battleStateId }: GameCanvasClientProps) {
    const [gameDimensions, setGameDimensions] = useState({ width: 0, height: 0 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [game, setGame] = useState<Phaser.Game | null>(null);
    const { mutateAsync: signTransaction } = useSignTransaction();
    const [battleState, setBattleState] = useState<BattleState>();
    const [isActionInProgress, setIsActionInProgress] = useState(false);

    // Hàm lấy trạng thái battle từ blockchain
    async function fetchBattleState() {
        if (!battleStateId) return;

        try {
            const state = await suiService.getBattleState(battleStateId) as unknown as BattleState;
            console.log("Updated battle state:", state);
            setBattleState(state);
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
                if (updatedState && updatedState.result !== "") {
                    if (updatedState.result === "player_win") {
                        alert("You won the battle!");
                    } else if (updatedState.result === "bot_win") {
                        alert("You lost the battle!");
                    }
                }

                setIsActionInProgress(false);
            }, 2000); // Đợi 2 giây cho giao dịch được xác nhận

        } catch (error) {
            console.error("Error using skill:", error);
            setIsActionInProgress(false);
        }
    };

    const uiScale = Math.min(
        Math.max(gameDimensions.width / 1000, 0.7),
        1.4
    );

    return (
        <>
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
                        disabled={isActionInProgress} // Disable skills khi đang thực hiện hành động
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
                        name={"Player"}
                        hp={battleState?.player_hp ?? 0}
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
                        hp={battleState?.bot_hp ?? 0}
                        maxHp={80}
                        avatarUrl={"/avatars/orc.jpg"}
                    />
                </div>
            </div>
        </>
    );
}