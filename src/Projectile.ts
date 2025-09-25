import { SCREEN_HEIGHT_WITH_HUD, SCREEN_WIDTH } from './Constants';
import { Direction } from './Direction';
import { Actor } from './Actor';
import { ZeldaGame } from './ZeldaGame';
import { Rectangle } from 'gtp';
import { Link } from './Link';
import { SpriteSheetSpriteLocation } from '@/SpriteSheetSpriteLocation';
import { Animation } from '@/Animation';
import { Enemy } from '@/enemy/Enemy';

export interface SpriteSheetProjectileRenderInfo {
    type: 'spriteSheet',
    sheetLocation: SpriteSheetSpriteLocation,
}
export interface AnimationProjectileRenderInfo {
    type: 'animation',
    animation: Animation,
}

/**
 * How the projectile should render itself each frame. If this is an animation,
 * the animation should loop to ensure it renders until it hits the edge of the
 * screen.
 */
export type ProjectileRenderInfo = SpriteSheetProjectileRenderInfo | AnimationProjectileRenderInfo;

/**
 * What the projectile should be able to hit. The default is 'link'. Note even if 'any'
 * is selected, a projectile can never hit its source actor.
 */
export type ProjectileTarget = 'link' | 'enemy' | 'any';

/**
 * A projectile thrown by an enemy or Link, such as a sword, rock or arrow.
 */
export class Projectile extends Actor {
    private readonly renderInfo: ProjectileRenderInfo;
    private source: Actor | null;
    private damage: number;
    private target: ProjectileTarget;

    constructor(game: ZeldaGame, renderInfo: ProjectileRenderInfo, x: number, y: number, dir: Direction) {
        super(game);
        this.renderInfo = renderInfo;
        this.damage = 1;
        this.target = 'link';

        // In the actual game, rocks start by completely overlapping the enemy who shoots them.  Honest!
        this.x = x;
        this.y = y;
        this.dir = dir;

        this.hitBox = new Rectangle();
    }

    collidedWith(other: Actor): boolean {
        if (this.target !== 'enemy' && other instanceof Link) {
            this.done = true;
            return true;
        }
        else if (this.target !== 'link' && other instanceof Enemy) {
            this.done = true;
            return true;
        }

        return false;
    }

    static create(game: ZeldaGame, source: Actor | null, sheetName: string, row: number, col: number, x: number,
        y: number, dir: Direction): Projectile {
        const sheetInfo: SpriteSheetProjectileRenderInfo = {
            type: 'spriteSheet',
            sheetLocation: {
                sheet: game.assets.get(sheetName),
                row,
                col,
            },
        };
        const projectile = new Projectile(game, sheetInfo, x, y, dir);
        projectile.setSource(source);
        return projectile;
    }

    getDamage(): number {
        return this.damage;
    }

    getSource(): Actor | null {
        return this.source;
    }

    paint(ctx: CanvasRenderingContext2D) {
        this.possiblyPaintHitBox(ctx);

        if (this.renderInfo.type === 'animation') {
            this.renderInfo.animation.setX(this.x);
            this.renderInfo.animation.setY(this.y);
            this.renderInfo.animation.paint(ctx);
        }
        else {
            const ss = this.renderInfo.sheetLocation.sheet;
            const row = this.renderInfo.sheetLocation.row;
            const col = this.renderInfo.sheetLocation.col;
            const index = row * 30 + col;
            ss.drawByIndex(ctx, this.x, this.y, index);
        }
    }

    setDamage(damage: number) {
        this.damage = damage;
    }

    setSource(source: Actor | null) {
        this.source = source;
    }

    setTarget(target: ProjectileTarget) {
        this.target = target;
    }

    targets(type: ProjectileTarget): boolean {
        return this.target === type || this.target === 'any';
    }

    update() {
        const SPEED = 2.5;

        if (this.renderInfo.type === 'animation') {
            this.renderInfo.animation.update();
        }

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
