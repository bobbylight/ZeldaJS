import { Rectangle, SpriteSheet } from 'gtp';
import { HERO_HITBOX_STYLE, SCREEN_HEIGHT, SCREEN_WIDTH, TILE_HEIGHT, TILE_WIDTH } from './Constants';
import { Direction } from './Direction';
import { Actor } from './Actor';
import { ZeldaGame } from './ZeldaGame';
import { Link } from './Link';
import { SpriteSheetSpriteLocation } from '@/SpriteSheetSpriteLocation';
import { Animation } from '@/Animation';
import { Enemy } from '@/enemy/Enemy';
import { SpriteSheetAndIndex } from '@/SpriteSheetAndIndex';

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

export type GoingOffScreenBehavior = 'completelyOffScreen' | 'onEdgeTile';

/**
 * A projectile thrown by an enemy or Link, such as a sword, rock or arrow.
 */
export class Projectile extends Actor {
    private readonly renderInfo: ProjectileRenderInfo;
    private source: Actor | null;
    private damage: number;
    private target: ProjectileTarget;
    private goingOffScreenBehavior: GoingOffScreenBehavior;

    constructor(game: ZeldaGame, renderInfo: ProjectileRenderInfo, x: number, y: number, dir: Direction) {
        super(game);
        this.renderInfo = renderInfo;
        this.damage = 1;
        this.target = 'link';
        this.goingOffScreenBehavior = 'completelyOffScreen';

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
        const sheet: SpriteSheet = game.assets.get(sheetName);
        const sheetInfo: SpriteSheetProjectileRenderInfo = {
            type: 'spriteSheet',
            sheetLocation: {
                sheet,
                row,
                col,
            },
        };
        const projectile = new Projectile(game, sheetInfo, x, y, dir);
        projectile.setSource(source);
        return projectile;
    }

    /**
     * If Link's shield can defend against this projectile, this image will "bounce" off of
     * his shield.
     */
    getBlockedImageSheetAndIndex(): SpriteSheetAndIndex {
        if (this.renderInfo.type === 'animation') {
            const ssi = this.renderInfo.animation.getCurrentFrameImage();
            return {
                sheet: ssi.sheet,
                index: ssi.index,
            };
        }

        // this.renderInfo.type === 'spriteSheet'
        const sheet = this.renderInfo.sheetLocation.sheet;
        return {
            sheet,
            index: this.renderInfo.sheetLocation.row * sheet.colCount + this.renderInfo.sheetLocation.col,
        };
    }

    getDamage(): number {
        return this.damage;
    }

    override getHitBoxStyle(): string {
        if (this.target === 'enemy') {
            return HERO_HITBOX_STYLE;
        }
        return super.getHitBoxStyle();
    }

    getSource(): Actor | null {
        return this.source;
    }

    override paintImpl(ctx: CanvasRenderingContext2D) {
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

    setGoingOffScreenBehavior(behavior: GoingOffScreenBehavior) {
        this.goingOffScreenBehavior = behavior;
    }

    targets(type: ProjectileTarget): boolean {
        return this.target === type || this.target === 'any';
    }

    private isOffScreenDown(): boolean {
        let edge = SCREEN_HEIGHT;
        if (this.goingOffScreenBehavior === 'onEdgeTile') {
            edge -= TILE_HEIGHT;
        }
        return this.y > edge;
    }

    private isOffScreenLeft(): boolean {
        let edge = -this.w;
        if (this.goingOffScreenBehavior === 'onEdgeTile') {
            edge += TILE_WIDTH;
        }
        return this.x < edge;
    }

    private isOffScreenRight(): boolean {
        let edge = SCREEN_WIDTH;
        if (this.goingOffScreenBehavior === 'onEdgeTile') {
            edge -= TILE_WIDTH;
        }
        return this.x > edge;
    }

    private isOffScreenUp(): boolean {
        let edge = -this.h;
        if (this.goingOffScreenBehavior === 'onEdgeTile') {
            edge += TILE_HEIGHT;
        }
        return this.y < edge;
    }

    override update() {
        super.update();
        const SPEED = 2.5;

        if (this.renderInfo.type === 'animation') {
            this.renderInfo.animation.update();
        }

        switch (this.dir) {
            case 'DOWN':
                this.y += SPEED;
                this.done ||= this.isOffScreenDown();
                break;
            case 'LEFT':
                this.x -= SPEED;
                this.done ||= this.isOffScreenLeft();
                break;
            case 'UP':
                this.y -= SPEED;
                this.done ||= this.isOffScreenUp();
                break;
            case 'RIGHT':
                this.x += SPEED;
                this.done ||= this.isOffScreenRight();
                break;
        }

        this.hitBox.set(this.x + 4, this.y + 3, this.w - 8, this.h - 6);
    }
}
