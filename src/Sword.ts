import { Rectangle, SpriteSheet } from 'gtp';
import { Link } from './Link';
import { ordinal } from './Direction';
import { Actor } from './Actor';
import { ZeldaGame } from './ZeldaGame';
import { AnimationProjectileRenderInfo, Projectile } from '@/Projectile';
import { Animation } from '@/Animation';
import { HERO_HITBOX_STYLE } from '@/Constants';

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

    private addSwordBeamEndAnimations(source: Actor) {
        const linkSheet: SpriteSheet = this.game.assets.get('link');
        const frameTime = 16;
        const step = 1.5;

        const topLeftAnim = new Animation(this.game, source.x - step, source.y - step);
        for (let i = 0; i < 4; i++) {
            topLeftAnim.addFrame({ sheet: linkSheet, index: 45 + 4 }, frameTime);
            topLeftAnim.addFrame({ sheet: linkSheet, index: 60 + 4 }, frameTime);
            topLeftAnim.addFrame({ sheet: linkSheet, index: 75 + 4 }, frameTime);
            topLeftAnim.addFrame({ sheet: linkSheet, index: 90 + 4 }, frameTime);
        }
        topLeftAnim.addListener({
            animationFrameUpdate: () => {
                topLeftAnim.setX(topLeftAnim.getX() - step);
                topLeftAnim.setY(topLeftAnim.getY() - step);
            },
            animationCompleted(anim: Animation) {
                // Do nothing
            },
        });
        this.game.addAnimation(topLeftAnim);

        const topRightAnim = new Animation(this.game, source.x + step, source.y - step);
        for (let i = 0; i < 4; i++) {
            topRightAnim.addFrame({ sheet: linkSheet, index: 45 + 5 }, frameTime);
            topRightAnim.addFrame({ sheet: linkSheet, index: 60 + 5 }, frameTime);
            topRightAnim.addFrame({ sheet: linkSheet, index: 75 + 5 }, frameTime);
            topRightAnim.addFrame({ sheet: linkSheet, index: 90 + 5 }, frameTime);
        }
        topLeftAnim.addListener({
            animationFrameUpdate: () => {
                topRightAnim.setX(topRightAnim.getX() + step);
                topRightAnim.setY(topRightAnim.getY() - step);
            },
            animationCompleted(anim: Animation) {
                // Do nothing
            },
        });
        this.game.addAnimation(topRightAnim);

        const bottomRightAnimation = new Animation(this.game, source.x + step, source.y + step);
        for (let i = 0; i < 4; i++) {
            bottomRightAnimation.addFrame({ sheet: linkSheet, index: 45 + 7 }, frameTime);
            bottomRightAnimation.addFrame({ sheet: linkSheet, index: 60 + 7 }, frameTime);
            bottomRightAnimation.addFrame({ sheet: linkSheet, index: 75 + 7 }, frameTime);
            bottomRightAnimation.addFrame({ sheet: linkSheet, index: 90 + 7 }, frameTime);
        }
        topLeftAnim.addListener({
            animationFrameUpdate: () => {
                bottomRightAnimation.setX(bottomRightAnimation.getX() + step);
                bottomRightAnimation.setY(bottomRightAnimation.getY() + step);
            },
            animationCompleted(anim: Animation) {
                // Do nothing
            },
        });
        this.game.addAnimation(bottomRightAnimation);

        const bottomLeftAnimation = new Animation(this.game, source.x - step, source.y + step);
        for (let i = 0; i < 4; i++) {
            bottomLeftAnimation.addFrame({ sheet: linkSheet, index: 45 + 6 }, frameTime);
            bottomLeftAnimation.addFrame({ sheet: linkSheet, index: 60 + 6 }, frameTime);
            bottomLeftAnimation.addFrame({ sheet: linkSheet, index: 75 + 6 }, frameTime);
            bottomLeftAnimation.addFrame({ sheet: linkSheet, index: 90 + 6 }, frameTime);
        }
        topLeftAnim.addListener({
            animationFrameUpdate: () => {
                bottomLeftAnimation.setX(bottomLeftAnimation.getX() - step);
                bottomLeftAnimation.setY(bottomLeftAnimation.getY() + step);
            },
            animationCompleted(anim: Animation) {
                // Do nothing
            },
        });
        this.game.addAnimation(bottomLeftAnimation);
    }

    private createSwordProjectile(): Projectile {
        const col = ordinal(this.dir);
        const linkSheet: SpriteSheet = this.game.assets.get('link');
        const animation = new Animation(this.game, this.x, this.y);
        animation.looping = true;
        const frameMillis = 30;
        animation.addFrame({ sheet: linkSheet, index: 45 + col }, frameMillis);
        animation.addFrame({ sheet: linkSheet, index: 60 + col }, frameMillis);
        animation.addFrame({ sheet: linkSheet, index: 75 + col }, frameMillis);
        animation.addFrame({ sheet: linkSheet, index: 90 + col }, frameMillis);

        const animInfo: AnimationProjectileRenderInfo = {
            type: 'animation',
            animation,
        };
        const projectile = new Projectile(this.game, animInfo, this.x, this.y, this.dir);
        projectile.setTarget('enemy');
        projectile.setGoingOffScreenBehavior('onEdgeTile');
        projectile.setOnRemove((screen) => {
            this.addSwordBeamEndAnimations(projectile);
            screen.setThrownSwordActorActive(false);
        })
        return projectile;
    }

    override getHitBoxStyle(): string {
        return HERO_HITBOX_STYLE;
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

    private possiblyThrowSword() {
        if (this.game.link.getShouldThrowSword()) {
            const screen = this.game.map.currentScreen;
            if (!screen.isThrownSwordActorActive()) {
                screen.addActor(this.createSwordProjectile());
                screen.setThrownSwordActorActive(true);
                this.game.audio.playSound('swordShoot');
            }
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

            if (this.frame === 12 * slowdownFactor - 1) {
                this.possiblyThrowSword();
            }
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
