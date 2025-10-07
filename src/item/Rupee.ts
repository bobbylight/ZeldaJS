import { AbstractItem } from './AbstractItem';
import { Actor } from '@/Actor';
import { ZeldaGame } from '@/ZeldaGame';
import Image from 'gtp/lib/gtp/Image';
import { Link } from '@/Link';
import Rectangle from 'gtp/lib/gtp/Rectangle';

export type RupeeDenomination = 'yellow' | 'blue' | 'red';

const RUPEE_COUNTS: Record<RupeeDenomination, number> = {
    yellow: 1,
    blue: 5,
    red: 20,
};

/**
 * Rupees, dropped by an enemy for example.  Adds some number of rupees into Link's wallet.
 */
export class Rupee extends AbstractItem {
    private readonly type: RupeeDenomination;
    private readonly rupeeCount: number;
    private readonly image: Image;

    constructor(game: ZeldaGame, x: number, y: number, type: RupeeDenomination = 'yellow') {
        super(game);
        this.x = x;
        this.y = y;
        this.w = 8;
        this.hitBox = new Rectangle(this.x, this.y, this.w, this.h);

        this.type = type;
        this.rupeeCount = RUPEE_COUNTS[this.type];
        this.image = game.assets.get(`treasures.${type}Rupee`);
    }

    collidedWith(other: Actor): boolean {
        if (other instanceof Link) {
            this.done = true;
            this.game.incRupees(this.rupeeCount);
            return true;
        }

        return false;
    }

    getRupeeCount(): number {
        return this.rupeeCount;
    }

    override paintImpl(ctx: CanvasRenderingContext2D): void {
        let image = this.image;

        // Only the yellow rupee blinks
        if (this.type === 'yellow' && this.visibleFrameCount % 16 >= 8) {
            image = this.game.assets.get('treasures.blueRupee');
        }

        image.draw(ctx, this.x, this.y);
    }
}
