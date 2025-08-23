import { SCREEN_HEIGHT_WITH_HUD, SCREEN_WIDTH } from './Constants';
import { Direction } from './Direction';
import { Actor } from './Actor';
import { ZeldaGame } from './ZeldaGame';
import { Rectangle, SpriteSheet } from 'gtp';
import { Link } from './Link';
declare let game: ZeldaGame;

/**
 * A projectile thrown by an enemy, such as a rock or arrow.
 */
export class Projectile extends Actor {
    private readonly ssRow: number;
    private readonly ssCol: number;
    private damage: number;

    constructor(ssRow: number, ssCol: number, x: number, y: number, dir: Direction) {
        super();
        this.ssRow = ssRow;
        this.ssCol = ssCol;
        this.damage = 1;

        // In the actual game, rocks start by completely overlapping the enemy who shoots them.  Honest!
        this.x = x;
        this.y = y;
        this.dir = dir;

        this.hitBox = new Rectangle();
    }

    collidedWith(other: Actor): boolean {
        if (other instanceof Link) {
            this.done = true;
            return true;
        }

        return false;
    }

    getDamage(): number {
        return this.damage;
    }

    paint(ctx: CanvasRenderingContext2D) {
        this.possiblyPaintHitBox(ctx);

        const ss: SpriteSheet = game.assets.get('enemies');
        const index: number = this.ssRow * 15 + this.ssCol;
        ss.drawByIndex(ctx, this.x, this.y, index);
    }

    setDamage(damage: number) {
        this.damage = damage;
    }

    update() {
        const SPEED: number = 2.5;

        switch (this.dir) {
            case 'DOWN':
                this.y += SPEED;
                if (this.y > SCREEN_HEIGHT_WITH_HUD + this.h) {
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
                if (this.x > SCREEN_WIDTH + this.w) {
                    this.done = true;
                }
                break;
        }

        this.hitBox.set(this.x + 4, this.y + 3, this.w - 8, this.h - 6);
    }
}
