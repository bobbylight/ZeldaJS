module zelda {
    'use strict';

    export const MOVE_AMT: number = 1;

    export abstract class Actor {

        dir: Direction;
        x: number;
        y: number;
        hitBox: gtp.Rectangle;
        frozen: boolean;
        takingDamage: boolean; // Not used by all actors
        done: boolean;

        constructor() {
            this.dir = Direction.DOWN;
            this.done = false;
        }

        abstract collidedWith(other: Actor): boolean;

        fromJson(json: ActorData): Actor {
            this.dir = json.dir;
            this.x = json.x;
            this.y = json.y;
            this.hitBox = json.hitBox;
            this.frozen = json.frozen;
            this.done = json.done;
            return this;
        }

        intersects(other: Actor): boolean {
            return this.hitBox.intersects(other.hitBox);
        }

        isEntirelyOn(tile: Position): boolean {
            const size: number = Constants.TILE_WIDTH; // TILE_HEIGHT is the same
            const x: number = tile.col * size;
            const y: number = tile.row * size;
            const tileBounds: gtp.Rectangle = new gtp.Rectangle(x, y, size, size);
            return tileBounds.containsRect(this.hitBox);
        }

        protected isHitBoxWalkable(dx: number = 0, dy: number = 0): boolean {

            const hitBox: gtp.Rectangle = this.hitBox;
            const x: number = hitBox.x + dx;
            const y: number = hitBox.y + dy;

            return game.isWalkable(this, x, y) &&
                game.isWalkable(this, x + hitBox.w - 1, y) &&
                game.isWalkable(this, x + hitBox.w - 1, y + hitBox.h - 1) &&
                game.isWalkable(this, x,                y + hitBox.h - 1);
        }

        abstract paint(ctx: CanvasRenderingContext2D): void;

        protected possiblyPaintHitBox(ctx: CanvasRenderingContext2D) {
            if (game.paintHitBoxes) {
                ctx.fillStyle = 'pink';
                const hitBox: gtp.Rectangle = this.hitBox;
                ctx.fillRect(hitBox.x, hitBox.y, hitBox.w, hitBox.h);
            }
        }

        setLocation(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        toJson(): ActorData {
            return {
                dir: this.dir,
                x: this.x,
                y: this.y,
                hitBox: this.hitBox,
                frozen: this.frozen,
                done: this.done
            };
        }

        abstract update(): void;
    }

    export interface ActorData {
        dir: Direction;
        x: number;
        y: number;
        hitBox: gtp.Rectangle;
        frozen: boolean;
        done: boolean;
    }
}