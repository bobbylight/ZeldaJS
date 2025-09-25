import { Link } from './Link';
import { ordinal } from './Direction';
import { Actor } from './Actor';
import { ZeldaGame } from './ZeldaGame';
import { Rectangle, SpriteSheet } from 'gtp';

/**
 * Initial frames, the sword isn't rendered as swinging.
 */
const SWORD_START_FRAME = 4;

/**
 * In the final frame, the sword isn't rendered. This frame acts as
 * a pause before the user can swing the sword again.
 */
const SWORD_SHEATHED_FRAME = 14;

/**
 * Increase this value to artificially slow down the sword strike.
 * Useful for debugging. A value of 1 is the default speed.
 */
const slowdownFactor = 1;

/**
 * A sword Link is in the middle of swinging.
 */
export class Sword extends Actor {
    private frame: number;

    constructor(game: ZeldaGame) {
        super(game);

        const link: Link = game.link;
        this.dir = link.dir;
        this.frame = 0;

        switch (this.dir) {
            case 'DOWN':
                this.x = link.x;
                this.y = link.y + 12;
                break;

            case 'LEFT':
                this.x = link.x - 16 + 4;
                this.y = link.y;
                break;

            case 'UP':
                this.x = link.x;
                this.y = link.y - 12;
                break;

            case 'RIGHT':
                this.x = link.x + 16 - 4;
                this.y = link.y;
                break;
        }

        this.hitBox = new Rectangle();
    }

    collidedWith(other: Actor): boolean {
        // Do nothing
        return false;
    }

    override getHitBoxStyle(): string {
        return 'blue';
    }

    paint(ctx: CanvasRenderingContext2D) {
        this.possiblyPaintHitBox(ctx);

        if (this.frame >= SWORD_START_FRAME * slowdownFactor &&
            this.frame <= SWORD_SHEATHED_FRAME * slowdownFactor) { // Some frames we aren't painted
            const ss: SpriteSheet = this.game.assets.get('link');
            const row = 3;
            const col: number = ordinal(this.dir);
            const index: number = row * 15 + col;
            ss.drawByIndex(ctx, this.x, this.y, index);
        }
    }

    update() {
        const link: Link = this.game.link;

        // The first 4 frames, the sword isn't rendered
        if (this.frame < SWORD_START_FRAME * slowdownFactor) {
            link.step = Link.FRAME_ACTION;
            this.hitBox.set(0, 0, 0, 0);
        }

        // The next 8 frames, the sword is fully extended.
        // This is the only time the sword can hit an enemy.
        else if (this.frame < 12 * slowdownFactor) {
            link.step = Link.FRAME_ACTION;

            let hx: number, hy: number, hw: number, hh: number;
            switch (this.dir) {
                case 'DOWN': // 24x32 hitbox
                    hx = link.x - 4; hy = link.y;
                    hw = 24; hh = 32;
                    break;
                case 'UP': // 24x32 hitbox
                    hx = link.x - 4; hy = link.y - 16;
                    hw = 24; hh = 32;
                    break;
                case 'LEFT': // 32x24 hitbox
                    hx = link.x - 16; hy = link.y - 4;
                    hw = 32; hh = 24;
                    break;
                case 'RIGHT': // 32x24 hitbox
                default:
                    hx = link.x; hy = link.y - 4;
                    hw = 32; hh = 24;
                    break;
            }
            this.hitBox.set(hx, hy, hw, hh);
        }

        // The next frame, the sword is slightly retracted
        else if (this.frame === 12 * slowdownFactor) {
            link.step = Link.FRAME_STEP;
            switch (this.dir) {
                case 'DOWN':
                    this.y -= 4;
                    break;
                case 'LEFT':
                    this.x += 4;
                    break;
                case 'UP':
                    this.y += 4;
                    break;
                case 'RIGHT':
                    this.x -= 4;
                    break;
            }
            this.hitBox.set(0, 0, 0, 0);
        }

        // The next frame, the sword is more retracted
        else if (this.frame === 13 * slowdownFactor) {
            link.step = Link.FRAME_STILL; // Link no longer swinging
            switch (this.dir) {
                case 'DOWN':
                    this.y -= 4;
                    break;
                case 'LEFT':
                    this.x += 4;
                    break;
                case 'UP':
                    this.y += 4;
                    break;
                case 'RIGHT':
                    this.x -= 4;
                    break;
            }
            this.hitBox.set(0, 0, 0, 0);
        }

        // The final frame, Link is doing nothing (pause before nex swing allowed)
        else if (this.frame === SWORD_SHEATHED_FRAME * slowdownFactor) {
            link.step = Link.FRAME_STILL; // Link no longer swinging
        }

        // The if-condition here just to allow "slowing down" of the final frame for debugging
        else if (this.frame === (SWORD_SHEATHED_FRAME + 1) * slowdownFactor) {
            link.step = Link.FRAME_STILL;
            link.frozen = false;
            this.done = true;
        }

        this.frame++;
    }
}
