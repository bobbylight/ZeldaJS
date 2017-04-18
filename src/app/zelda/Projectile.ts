import {Constants} from './Constants';
import {Direction} from './Direction';
import {Actor} from './Actor';
import {ZeldaGame} from './ZeldaGame';
import {Rectangle, SpriteSheet} from 'gtp';
declare let game: ZeldaGame;

/**
 * A projectile thrown by an enemy, such as a rock or arrow.
 */
export class Projectile extends Actor {

    private _ssRow: number;
    private _ssCol: number;

    constructor(ssRow: number, ssCol: number, x: number, y: number, dir: Direction) {

        super();
        this._ssRow = ssRow;
        this._ssCol = ssCol;

        // In the actual game, rocks start by completely overlapping the enemy who shoots them.  Honest!
        this.x = x;
        this.y = y;
        this.dir = dir;

        this.hitBox = new Rectangle();
    }

    collidedWith(other: Actor): boolean {
        // Do nothing
        return false;
    }

    paint(ctx: CanvasRenderingContext2D) {

        this.possiblyPaintHitBox(ctx);

        const ss: SpriteSheet = <SpriteSheet>game.assets.get('enemies');
        const index: number = this._ssRow * 15 + this._ssCol;
        ss.drawByIndex(ctx, this.x, this.y, index);
    }

    update() {

        const SPEED: number = 3;

        switch (this.dir) {
            case 'DOWN':
                this.y += SPEED;
                if (this.y > Constants.SCREEN_HEIGHT_WITH_HUD + this.h) {
                    this.done = true;
                }
                break;
            case 'LEFT':
                this.x -= SPEED;
                if (this.x < -this.w) {
                    this.done = true;
                }
                break;
            case 'UP':
                this.y -= SPEED;
                if (this.y < -this.h) {
                    this.done = true;
                }
                break;
            case 'RIGHT':
                this.x += SPEED;
                if (this.x > Constants.SCREEN_WIDTH + this.w) {
                    this.done = true;
                }
                break;
        }

        this.hitBox.set(this.x + 4, this.y + 3, this.w - 8, this.h - 6);
    }
}
