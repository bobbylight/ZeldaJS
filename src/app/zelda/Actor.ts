import {Direction} from './Direction';
import {Constants} from './Constants';
import {ZeldaGame} from './ZeldaGame';
import {Position} from './Position';
import {Rectangle} from 'gtp';
declare let game: ZeldaGame;

export const MOVE_AMT: number = 1;

/**
 * A base class for entities with state - Link, enemies, etc.
 */
export abstract class Actor {

    dir: Direction;
    x: number;
    y: number;
    w: number;
    h: number;
    hitBox: Rectangle;
    frozen: boolean;
    takingDamage: boolean; // Not used by all actors
    done: boolean;

    constructor() {

        this.dir = Direction.DOWN;
        this.done = false;

        // Almost all characters are 1 tile in size; those that aren't can override
        this.w = Constants.TILE_WIDTH;
        this.h = Constants.TILE_HEIGHT;
    }

    /**
     * Called when this actor collides with another.
     *
     * @param other The entity we collided with.
     * @return Whether this actor should be considered "dead" after the collision.
     */
    abstract collidedWith(other: Actor): boolean;

    /**
     * Initializes this actor based on a JSON representation of it.
     * @param json The JSON representation of the actor.
     * @returns {zelda.Actor} This actor.
     */
    fromJson(json: ActorData): Actor {
        this.dir = json.dir;
        this.x = json.x;
        this.y = json.y;
        this.hitBox = json.hitBox;
        this.frozen = json.frozen;
        this.done = json.done;
        return this;
    }

    /**
     * Returns whether this actor intersects another.
     *
     * @param other The other actor.
     * @returns {boolean} Whether the two intersect.
     */
    intersects(other: Actor): boolean {
        return this.hitBox.intersects(other.hitBox);
    }

    /**
     * Returns whether this actor is entirely on a specific tile.
     * @param tile The row/column of the tile.
     * @returns {boolean} Whether this actor is entirely on the tile.
     */
    isEntirelyOn(tile: Position): boolean {
        const size: number = Constants.TILE_WIDTH; // TILE_HEIGHT is the same
        const x: number = tile.col * size;
        const y: number = tile.row * size;
        const tileBounds: Rectangle = new Rectangle(x, y, size, size);
        return tileBounds.containsRect(this.hitBox);
    }

    /**
     * Returns whether this actor's hitbox, optionally plus some offset, is "walkable."
     *
     * @param dx An x-offset to apply to the hitbox.
     * @param dy A y-offset to apply to the hitbox.
     * @returns {boolean} Whether the hitbox is walkable.
     */
    protected isHitBoxWalkable(dx: number = 0, dy: number = 0): boolean {

        const hitBox: Rectangle = this.hitBox;
        const x: number = hitBox.x + dx;
        const y: number = hitBox.y + dy;

        return game.isWalkable(this, x, y) &&
            game.isWalkable(this, x + hitBox.w - 1, y) &&
            game.isWalkable(this, x + hitBox.w - 1, y + hitBox.h - 1) &&
            game.isWalkable(this, x,                y + hitBox.h - 1);
    }

    /**
     * Renders this actor.
     * @param ctx The rendering context to use.
     */
    abstract paint(ctx: CanvasRenderingContext2D): void;

    /**
     * Renders this actor's hitbox, if enabled.
     * @param ctx The rendering context to use.
     */
    protected possiblyPaintHitBox(ctx: CanvasRenderingContext2D) {
        if (game.paintHitBoxes) {
            ctx.fillStyle = 'pink';
            const hitBox: Rectangle = this.hitBox;
            ctx.fillRect(hitBox.x, hitBox.y, hitBox.w, hitBox.h);
        }
    }

    /**
     * Sets the location of this actor.
     * @param x The x-offset.
     * @param y The y-offset.
     */
    setLocation(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Returns a JSON representation of this actor.
     * @returns The JSON representation.
     */
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

    /**
     * Called each frame.  Actor implementations should override this method to perform any
     * per-frame logic.
     */
    abstract update(): void;
}

/**
 * Information about an actor, for loading/saving purposes.
 */
export interface ActorData {
    dir: Direction;
    x: number;
    y: number;
    hitBox: Rectangle;
    frozen: boolean;
    done: boolean;
}
