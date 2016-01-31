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

        setLocation(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        abstract update(): void;
    }
}