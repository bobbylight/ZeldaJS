import { AbstractItem } from './AbstractItem';
import { Actor } from '@/Actor';
import Image from 'gtp/lib/gtp/Image';
import Rectangle from 'gtp/lib/gtp/Rectangle';
import { ZeldaGame } from '@/ZeldaGame';
import { Link } from '@/Link';
declare let game: ZeldaGame;

/**
 * Adds a single heart to Link's health.
 */
export class Heart extends AbstractItem {
    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.w = 8;
        this.hitBox = new Rectangle(this.x, this.y, this.w, this.h);
    }

    collidedWith(other: Actor): boolean {
        if (other instanceof Link) {
            this.done = true;
            game.link.incHealth();
            return true;
        }

        return false;
    }

    paint(ctx: CanvasRenderingContext2D) {
        const imageName: string = game.playTime % 1000 < 500 ? 'fullHeart' : 'blueHeart';
        const image: Image = game.assets.get(`treasures.${imageName}`);
        image.draw(ctx, this.x, this.y);
    }

    update() {
    }
}
