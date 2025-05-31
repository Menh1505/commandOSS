import { useEffect, useState } from "react";
import * as Phaser from "phaser";
import HP from './HP';
import SkillPanel from './SkillPanel';
import { Skill } from '@/types/skill.type';

export default function GameCanvasClient() {
    // State lưu trữ kích thước game
    const [gameDimensions, setGameDimensions] = useState({ width: 0, height: 0 });
    const [game, setGame] = useState<Phaser.Game | null>(null);

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

    const useSkill = (skill: Skill) => {
        console.log("Using skill:", skill);
        if (game && game.scene.isActive('MainScene')) {
            // Xử lý kỹ năng
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
                    <SkillPanel onClick={useSkill} disabled={false} />
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
                    <HP name={"Player"} hp={100} maxHp={100} avatarUrl={"/avatars/notion.png"} />
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
                    <HP name={"Enemy"} hp={80} maxHp={100} avatarUrl={"/avatars/orc.jpg"} />
                </div>
            </div>
        </>
    );
}