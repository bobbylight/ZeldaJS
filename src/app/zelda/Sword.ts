import { Link } from './Link';
import { DirectionUtil } from './Direction';
import { Actor } from './Actor';
import { ZeldaGame } from './ZeldaGame';
import { Rectangle, SpriteSheet } from 'gtp';
declare let game: ZeldaGame;

export class Sword extends Actor {

    private frame: number;

    constructor() {
        super();

        const link: Link = game.link;
        this.dir = link.dir;
        this.frame = 16;

        switch (this.dir) {
            case 'DOWN':
                this.x = link.x;
                this.y = link.y + 12;
                break;

            case 'LEFT':
                this.x = link.x - 16 + 6;
                this.y = link.y;
                break;

            case 'UP':
                this.x = link.x;
                this.y = link.y - 12;
                break;

            case 'RIGHT':
                this.x = link.x + 16 - 6;
                this.y = link.y;
                break;
        }

        this.hitBox = new Rectangle();
    }

    collidedWith(other: Actor): boolean {
        // Do nothing
        return false;
    }

    paint(ctx: CanvasRenderingContext2D) {

        this.possiblyPaintHitBox(ctx);

        if (this.frame >= 0 && this.frame < 14) { // First two frames, we aren't painted
            const ss: SpriteSheet = <SpriteSheet>game.assets.get('link');
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
                case 'DOWN':
                    this.y -= 6;
                    break;
                case 'LEFT':
                    this.x += 6;
                    break;
                case 'UP':
                    this.y += 6;
                    break;
                case 'RIGHT':
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
                case 'DOWN':
                case 'UP':
                    hx = this.x + 4; hy = this.y;
                    hw = 8; hh = this.h;
                    break;
                case 'LEFT':
                case 'RIGHT':
                default:
                    hx = this.x; hy = this.y + 6;
                    hw = this.w; hh = 8;
                    break;
            }
            this.hitBox.set(hx, hy, hw, hh);
        }
        else {
            this.hitBox.set(0, 0, 0, 0);
        }

    }
}
