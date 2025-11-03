import { Rectangle } from 'gtp';
import { Actor } from '@/Actor';
import { ZeldaGame } from '@/ZeldaGame';
import { TILE_HEIGHT } from '@/Constants';
import { AbstractItem } from '@/item/AbstractItem';
import { Link } from '@/Link';
import { Heart } from '@/item/Heart';

/**
 * An item Link can buy in a shop.
 */
export class ShopItem extends Actor {
    constructor(game: ZeldaGame, private readonly item: AbstractItem,
                private readonly price: number, x: number, y: number) {
        super(game);
        item.hitBox.x = item.x = this.x = x;
        item.hitBox.y = item.y = this.y = y + TILE_HEIGHT - item.h;
        this.w = item.w;
        this.h = item.h;
        this.hitBox = new Rectangle(this.x, this.y, item.w, item.h);
        this.isPartOfInteraction = true;
    }

    collidedWith(other: Actor): boolean {
        if (other instanceof Link && this.price <= other.getRupeeCount()) {
            this.item.collidedWith(other);
            this.game.incRupees(-this.price);
            this.game.map.currentScreen.endInteraction(this.item);
            this.done = true;
            return true;
        }
        return false;
    }

    static create(game: ZeldaGame, type: string, price: number, x: number, y: number) {
        let item: AbstractItem;
        switch (type) {
            default:
            case 'heart':
                item = new Heart(game, x, y);
                break;
        }

        item.blinksWhenNew = false;
        return new ShopItem(game, item, price, x, y);
    }

    override paintImpl(ctx: CanvasRenderingContext2D) {
        this.item.paint(ctx);

        const x = this.x - (this.price > 100 ? 10 : 4);
        const y = this.y + this.h + TILE_HEIGHT * 0.5;
        this.game.drawString(x, y, this.price, ctx);
    }

    override update() {
        super.update();
        this.item.update();
    }
}
