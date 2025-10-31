import { Image, Rectangle } from 'gtp';
import { AbstractItem } from './AbstractItem';
import { Actor } from '@/Actor';
import { ZeldaGame } from '@/ZeldaGame';
import { Link } from '@/Link';

/**
 * Adds a single heart to Link's health.
 */
export class Heart extends AbstractItem {
    constructor(game: ZeldaGame, x: number, y: number) {
        super(game);
        this.x = x;
        this.y = y;
        this.w = 8;
        this.hitBox = new Rectangle(this.x, this.y, this.w, this.h);
    }

    collidedWith(other: Actor): boolean {
        if (other instanceof Link) {
            this.done = true;
            this.game.link.incHealth();
            return true;
        }

        return false;
    }

    override paintImpl(ctx: CanvasRenderingContext2D) {
        const imageName: string = this.visibleFrameCount % 16 >= 8 ? 'fullHeart' : 'blueHeart';
        const image: Image = this.game.assets.get(`treasures.${imageName}`);
        image.draw(ctx, this.x, this.y);
    }
}
