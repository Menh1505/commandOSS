import { useEffect } from "react";
import * as Phaser from "phaser";

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


                const player = this.add.sprite(width / 4, 600, 'player', 0).setScale(2);

                const enemy = this.add.sprite(width / 4 * 3, 600, 'enemy', 0).setScale(2);
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

    return null;
}