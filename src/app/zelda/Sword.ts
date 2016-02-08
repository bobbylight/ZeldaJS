module zelda {
    'use strict';

    export class Sword extends Actor {

        private frame: number;

        constructor() {
            super();

            const link: Link = game.link;
            this.dir = link.dir;
            this.frame = 16;

            switch (this.dir) {
                case Direction.DOWN:
                    this.x = link.x;
                    this.y = link.y + 12;
                    break;

                case Direction.LEFT:
                    this.x = link.x - 16 + 6;
                    this.y = link.y;
                    break;

                case Direction.UP:
                    this.x = link.x;
                    this.y = link.y - 12;
                    break;

                case Direction.RIGHT:
                    this.x = link.x + 16 - 6;
                    this.y = link.y;
                    break;
            }

            this.hitBox = new gtp.Rectangle();
        }

        collidedWith(other: Actor): boolean {
            // Do nothing
            return false;
        }

        paint(ctx: CanvasRenderingContext2D) {

            if (game.paintHitBoxes) {
                ctx.fillStyle = 'pink';
                ctx.fillRect(this.hitBox.x, this.hitBox.y, this.hitBox.w, this.hitBox.h);
            }

            if (this.frame >= 0 && this.frame < 14) { // First two frames, we aren't painted
                const ss: gtp.SpriteSheet = <gtp.SpriteSheet>game.assets.get('link');
                const row: number = 3;
                const col: number = DirectionUtil.ordinal(this.dir);
                const index: number = row * 15 + col;
                ss.drawByIndex(ctx, this.x, this.y, index);
            }
        }

        update() {

            const link: Link = game.link;
            this.frame--;

            if (this.frame === 3) {
                link.step = Link.FRAME_STEP;
                switch (this.dir) {
                    case Direction.DOWN:
                        this.y -= 6;
                        break;
                    case Direction.LEFT:
                        this.x += 6;
                        break;
                    case Direction.UP:
                        this.y += 6;
                        break;
                    case Direction.RIGHT:
                        this.x -= 6;
                        break;
                }
            }

            else if (this.frame === 0) {
                link.frozen = false;
                link.step = Link.FRAME_STILL;
                this.done = true;
            }

            if (this.frame > 6 && this.frame < 11) {
                let hx: number, hy: number, hw: number, hh: number;
                switch (this.dir) {
                    case Direction.DOWN:
                    case Direction.UP:
                        hx = this.x + 4; hy = this.y;
                        hw = 8; hh = 16;
                        break;
                    case Direction.LEFT:
                    case Direction.RIGHT:
                    default:
                        hx = this.x; hy = this.y + 6;
                        hw = 16; hh = 8;
                        break;
                }
                this.hitBox.set(hx, hy, hw, hh);
            }
            else {
                this.hitBox.set(0, 0, 0, 0);
            }

        }
    }
}