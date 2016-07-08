module zelda {
    'use strict';

    export class Arrow extends Actor {

        private frame: number;

        constructor(x: number, y: number, dir: Direction) {
            super();

            this.x = x;
            this.y = y;
            this.dir = dir;
            this.frame = 16;

            switch (this.dir) {
                case Direction.DOWN:
                    this.y += 12;
                    break;

                case Direction.LEFT:
                    this.x = this.x - 16 + 6;
                    break;

                case Direction.UP:
                    this.y -= 12;
                    break;

                case Direction.RIGHT:
                    this.x = this.x + 16 - 6;
                    break;
            }

            this.hitBox = new gtp.Rectangle();
        }

        collidedWith(other: Actor): boolean {
            // Do nothing
            return false;
        }

        paint(ctx: CanvasRenderingContext2D) {

            this.possiblyPaintHitBox(ctx);

            const ss: gtp.SpriteSheet = <gtp.SpriteSheet>game.assets.get('link');
            const row: number = 3;
            const col: number = DirectionUtil.ordinal(this.dir);
            const index: number = row * 15 + col;
            ss.drawByIndex(ctx, this.x, this.y, index);
        }

        update() {

            this.frame--;
            const SPEED: number = 3;

            switch (this.dir) {
                case Direction.DOWN:
                    this.y += SPEED;
                    if (this.y > Constants.SCREEN_HEIGHT_WITH_HUD + 16) {
                        this.done = true;
                    }
                    break;
                case Direction.LEFT:
                    this.x -= SPEED;
                    if (this.x < -16) {
                        this.done = true;
                    }
                    break;
                case Direction.UP:
                    this.y -= SPEED;
                    if (this.y < -16) {
                        this.done = true;
                    }
                    break;
                case Direction.RIGHT:
                    this.x += SPEED;
                    if (this.x > Constants.SCREEN_WIDTH + 16) {
                        this.done = true;
                    }
                    break;
            }

            this.hitBox.set(this.x, this.y, 16, 16);
        }
    }
}