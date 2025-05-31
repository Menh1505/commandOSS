import { useEffect } from "react";
import * as Phaser from "phaser";
import HP from './HP';
import SkillPanel from './SkillPanel';
import { Skill } from '@/types/skill.type';

export default function GameCanvasClient() {
    useEffect(() => {
        const container = document.getElementById('game-container');
        if (!container) return;
        container.innerHTML = '';

        const width = container.clientWidth;
        const height = 800;

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


                const player = this.add.sprite(width / 4, 500, 'player', 0).setScale(4);

                const enemy = this.add.sprite(width / 4 * 3, 500, 'enemy', 0).setScale(4);
                enemy.flipX = true;

                this.anims.create({
                    key: 'enemy_idle',
                    frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
                    frameRate: 8,
                    repeat: -1
                });

                // Tạo animation nhân vật
                this.anims.create({
                    key: 'idle',
                    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
                    frameRate: 8,
                    repeat: -1
                });

                // Phát animation
                player.play('idle');
                enemy.play('enemy_idle');
            }
        }

        const game = new Phaser.Game({
            type: Phaser.AUTO,
            width: width,
            height: height,
            backgroundColor: "#111827",
            parent: 'game-container',
            scene: [MainScene],
        });

        return () => {
            game.destroy(true);
        };
    }, []);

    const useSkill = (skill: Skill) => {
        console.log("Using skill:", skill);
        // Thực hiện logic sử dụng skill ở đây
    };
    return (
        <>
            <div
                className="absolute z-10"
                style={{
                    bottom: '10%',
                    left: '50%',
                    transform: 'translate(-50%, 50%)'
                }}
            >
                <div className="w-full max-w-md px-4">
                    <SkillPanel onClick={useSkill} disabled={false} />
                </div>
            </div>

            <div
                className="absolute z-10 bottom-5 left-5"
            >
                <div className="w-full max-w-md px-4 scale-150 transform origin-bottom-left">
                    <HP name={"Player"} hp={100} maxHp={100} avatarUrl={"/avatars/notion.png"} />
                </div>
            </div>

            <div
                className="absolute z-10 bottom-5 right-5"
            >
                <div className="w-full max-w-md px-4 scale-150 transform origin-bottom-right">
                    <HP name={"Enemy"} hp={80} maxHp={100} avatarUrl={"/avatars/orc.jpg"} />
                </div>
            </div>
        </>
    );
}