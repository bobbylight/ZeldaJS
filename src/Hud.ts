import { Image } from 'gtp';
import { ZeldaGame } from './ZeldaGame';
import { Link } from './Link';

export class Hud {
    constructor(private readonly game: ZeldaGame) {
    }

    private paintMap(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#83d313';
        const s = 3;

        // Note that the map isn't a perfect grid; there is a 1-pixel area
        // on the left and bottom of the gray area that is never highlighted
        // as a screen Link is on.  We could fix that, but this ia a faithful
        // reproduction
        const x: number = 17 + this.game.map.currentScreenCol * (s + 1);
        const y: number = 24 + this.game.map.currentScreenRow * (s + 1);

        ctx.fillRect(x, y, s, s);
    }

    render(ctx: CanvasRenderingContext2D) {
        const game = this.game;
        const hudMockup: Image = game.assets.get('hud');
        hudMockup.draw(ctx, 0, 0);

        const link: Link = game.link;
        const health: number = link.getHealth();
        const maxHealth: number = link.getMaxHealth();

        const heart: Image = game.assets.get('treasures.fullHeart');

        let x = 176;
        const y = 48;
        const wholeHeartCount: number = Math.floor(health / 2);
        const heartCount: number = maxHealth / 2;

        this.renderItemInBSlot(ctx);

        // Hundreds digit replaces the "x"
        let rupeeCount: string | number = link.getRupeeCount();
        if (rupeeCount < 100) {
            rupeeCount = `X${rupeeCount}`;
        }
        game.drawString(96, 24, rupeeCount);

        game.drawString(104, 48, link.getBombCount());

        for (let i = 0; i < wholeHeartCount; i++) {
            heart.draw(ctx, x, y);
            x += 8;
        }
        let drawnHeartCount: number = wholeHeartCount;
        if (health % 2 === 1) {
            const halfHeart: Image = game.assets.get('treasures.halfHeart');
            halfHeart.draw(ctx, x, y);
            x += 8;
            drawnHeartCount++;
        }

        const emptyHeart: Image = game.assets.get('treasures.emptyHeart');
        while (drawnHeartCount < heartCount) {
            emptyHeart.draw(ctx, x, y);
            x += 8;
            drawnHeartCount++;
        }

        this.paintMap(ctx);
    }

    private renderItemInBSlot(ctx: CanvasRenderingContext2D) {
        const bomb: Image = this.game.assets.get('treasures.bomb');

        bomb.draw(ctx, 128, 33);
    }
}
