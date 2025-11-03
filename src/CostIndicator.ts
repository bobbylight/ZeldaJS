import { Rectangle } from 'gtp';
import { Actor } from '@/Actor';
import { ZeldaGame } from '@/ZeldaGame';
import { Rupee } from '@/item/Rupee';

/**
 * Part of the display in caves like shops. Displays a rupee with a "x"
 * aligned with the prices of each item.
 */
export class CostIndicator extends Actor {
    private readonly rupee: Rupee;

    constructor(game: ZeldaGame, x = 52, y = 108) {
        super(game);
        this.x = x;
        this.y = y;
        this.hitBox = new Rectangle();
        this.rupee = new Rupee(game, this.x, this.y);
        this.rupee.blinksWhenNew = false;
        this.isPartOfInteraction = true;
    }

    collidedWith(other: Actor): boolean {
        return false;
    }

    override paintImpl(ctx: CanvasRenderingContext2D) {
        this.rupee.paint(ctx);
        this.game.drawString(this.x + 12, this.y + 4, 'X', ctx);
    }

    override update() {
        super.update();
        this.rupee.update();
    }
}
