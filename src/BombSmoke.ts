import { Rectangle, SpriteSheet } from 'gtp';
import { Actor } from '@/Actor';
import { ZeldaGame } from '@/ZeldaGame';
import { Direction } from '@/Direction';
import { HERO_HITBOX_STYLE, TILE_HEIGHT, TILE_WIDTH } from '@/Constants';

interface FrameInfo {
    dir: Direction;
    index: number;
}

const leftFrameInfos: FrameInfo[] = [
    { dir: 'LEFT', index: 34 },
    { dir: 'RIGHT', index: 34 },

    // TODO: 4 frames of brighter screen, no smoke, instead of smoke
    { dir: 'LEFT', index: 34 },
    { dir: 'RIGHT', index: 34 },
    { dir: 'LEFT', index: 34 },
    { dir: 'RIGHT', index: 34 },

    { dir: 'LEFT', index: 34 },

    // TODO: 4 frames of brighter screen, no smoke, instead of smoke
    { dir: 'RIGHT', index: 34 },
    { dir: 'LEFT', index: 34 },
    { dir: 'RIGHT', index: 34 },
    { dir: 'LEFT', index: 34 },

    { dir: 'RIGHT', index: 34 },
    { dir: 'LEFT', index: 34 },
    { dir: 'RIGHT', index: 34 },
    { dir: 'LEFT', index: 34 },
    { dir: 'RIGHT', index: 34 },
    { dir: 'LEFT', index: 34 },
    { dir: 'RIGHT', index: 34 },

    { dir: 'LEFT', index: 35 },
    { dir: 'RIGHT', index: 35 },
    { dir: 'LEFT', index: 35 },
    { dir: 'RIGHT', index: 35 },
    { dir: 'LEFT', index: 35 },
    { dir: 'RIGHT', index: 35 },
    { dir: 'LEFT', index: 35 },
    { dir: 'RIGHT', index: 35 },
    { dir: 'LEFT', index: 35 },
    { dir: 'RIGHT', index: 35 },
    { dir: 'LEFT', index: 35 },
    { dir: 'RIGHT', index: 35 },
];


const rightFrameInfos: FrameInfo[] = [
    { dir: 'RIGHT', index: 34 },
    { dir: 'LEFT', index: 34 },

    // TODO: 4 frames of brighter screen, no smoke, instead of smoke
    { dir: 'RIGHT', index: 34 },
    { dir: 'LEFT', index: 34 },
    { dir: 'RIGHT', index: 34 },
    { dir: 'LEFT', index: 34 },

    { dir: 'RIGHT', index: 34 },

    // TODO: 4 frames of brighter screen, no smoke, instead of smoke
    { dir: 'LEFT', index: 34 },
    { dir: 'RIGHT', index: 34 },
    { dir: 'LEFT', index: 34 },
    { dir: 'RIGHT', index: 34 },

    { dir: 'LEFT', index: 34 },
    { dir: 'RIGHT', index: 34 },
    { dir: 'LEFT', index: 34 },
    { dir: 'RIGHT', index: 34 },
    { dir: 'LEFT', index: 34 },
    { dir: 'RIGHT', index: 34 },
    { dir: 'LEFT', index: 34 },

    { dir: 'RIGHT', index: 35 },
    { dir: 'LEFT', index: 35 },
    { dir: 'RIGHT', index: 35 },
    { dir: 'LEFT', index: 35 },
    { dir: 'RIGHT', index: 35 },
    { dir: 'LEFT', index: 35 },
    { dir: 'RIGHT', index: 35 },
    { dir: 'LEFT', index: 35 },
    { dir: 'RIGHT', index: 35 },
    { dir: 'LEFT', index: 35 },
    { dir: 'RIGHT', index: 35 },
    { dir: 'LEFT', index: 35 },
];

const dirToFrameInfos = new Map<Direction, FrameInfo[]>();
dirToFrameInfos.set('LEFT', leftFrameInfos);
dirToFrameInfos.set('DOWN', leftFrameInfos);
dirToFrameInfos.set('RIGHT', rightFrameInfos);
dirToFrameInfos.set('UP', rightFrameInfos);

const MAX_DAMAGING_FRAME = 30;

/**
 * An actor that can't collide with any other actors. It's essentially just a
 * visual effect that's a collection of animations.
 */
export class BombSmoke extends Actor {
    private frame: number;

    constructor(game: ZeldaGame, dir: Direction, override x: number, override y: number) {
        super(game);
        this.dir = dir;
        this.frame = 0;
        this.hitBox = new Rectangle(x, y, TILE_WIDTH, TILE_HEIGHT);
    }

    canDamageEnemies(): boolean {
        return this.frame <= MAX_DAMAGING_FRAME;
    }

    override collidedWith(other: Actor): boolean {
        return false;
    }

    override getHitBoxStyle(): string {
        return HERO_HITBOX_STYLE;
    }

    override paint(ctx: CanvasRenderingContext2D) {
        const frameInfos = dirToFrameInfos.get(this.dir);
        if (frameInfos) { // Always true
            const frameInfo = frameInfos[this.frame];

            if (frameInfo.dir === 'LEFT' || frameInfo.dir === 'DOWN') {
                this.paintSmokeLeftOrientation(ctx, frameInfo.index);
            }
            else {
                this.paintSmokeRightOrientation(ctx, frameInfo.index);
            }
        }

        this.possiblyPaintHitBox(ctx);
    }

    private paintSmokeLeftOrientation(ctx: CanvasRenderingContext2D, index: number) {
        const ss: SpriteSheet = this.game.assets.get('link');

        ss.drawByIndex(ctx, this.x, this.y, index);
        ss.drawByIndex(ctx, this.x + 8, this.y - 15, index);
        ss.drawByIndex(ctx, this.x - 8, this.y + 15, index);
        ss.drawByIndex(ctx, this.x - 16, this.y, index);
    }

    private paintSmokeRightOrientation(ctx: CanvasRenderingContext2D, index: number) {
        const ss: SpriteSheet = this.game.assets.get('link');

        ss.drawByIndex(ctx, this.x, this.y, index);
        ss.drawByIndex(ctx, this.x - 8, this.y - 15, index);
        ss.drawByIndex(ctx, this.x + 8, this.y + 15, index);
        ss.drawByIndex(ctx, this.x + 16, this.y, index);
    }

    override update() {
        this.frame++;
        if (this.frame === 1) {
            this.game.map.currentScreen.checkForBombableWalls(this.hitBox);
        }
        else if (this.frame === MAX_DAMAGING_FRAME / 2) {
            // Note: I don't know the exact bomb radius or timing. But in the real game, it "feels"
            // like it's not initially the entire bounding box, but eventually grows to be.
            // This is just an attempt to mimic that.
            this.hitBox = new Rectangle(this.x - TILE_WIDTH, this.y - TILE_HEIGHT, 3 * TILE_WIDTH, 3 * TILE_HEIGHT);
            this.game.map.currentScreen.checkForBombableWalls(this.hitBox);
        }
        else if (this.frame >= (dirToFrameInfos.get(this.dir)?.length ?? 0)) {
            this.done = true;
        }
    }
}
