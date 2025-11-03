import { Image, Rectangle } from 'gtp';
import { Character } from '@/Character';
import { Actor } from '@/Actor';
import { ZeldaGame } from '@/ZeldaGame';

export type NpcType = 'merchant' | 'moblin' | 'oldMan1' | 'oldMan2' | 'oldWoman';

/**
 * A character that Link interacts with that stands in one place, such as an
 * old man or a Moblin that gives money.
 */
export class Npc extends Character {
    constructor(game: ZeldaGame, private readonly type: NpcType, x: number, y: number) {
        super(game);
        this.x = x;
        this.y = y;
        this.hitBox = new Rectangle(x, y, this.w, this.h);
    }

    collidedWith(other: Actor): boolean {
        return false;
    }

    override paintImpl(ctx: CanvasRenderingContext2D) {
        const image: Image = this.game.assets.get(`npcs.${this.type}`);
        image.draw(ctx, this.x, this.y);
    }
}
