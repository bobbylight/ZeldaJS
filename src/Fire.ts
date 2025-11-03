import { Image, Rectangle } from 'gtp';
import { Actor } from '@/Actor';
import { ZeldaGame } from '@/ZeldaGame';

/**
 * A fire, such as one in a cave.
 */
export class Fire extends Actor {
    constructor(game: ZeldaGame, x: number, y: number) {
        super(game);
        this.x = x;
        this.y = y;
        this.hitBox = new Rectangle(x, y, this.w, this.h);
    }

    collidedWith(other: Actor): boolean {
        return false;
    }

    override paintImpl(ctx: CanvasRenderingContext2D) {
        const imageName: string = this.visibleFrameCount % 12 > 6 ? 'fire1' : 'fire2';
        const image: Image = this.game.assets.get(`npcs.${imageName}`);
        image.draw(ctx, this.x, this.y);
    }
}
