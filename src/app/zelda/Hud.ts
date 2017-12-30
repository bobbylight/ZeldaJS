import { ZeldaGame } from './ZeldaGame';
import Image from 'gtp/lib/gtp/Image';
import { Link } from './Link';

declare let game: ZeldaGame;

export class Hud {

    render(ctx: CanvasRenderingContext2D) {

        const hudMockup: Image = game.assets.get('hud') as Image;
        hudMockup.draw(ctx, 0, 0);

        const link: Link = game.link;
        const health: number = link.getHealth();
        const maxHealth: number = link.getMaxHealth();
        const oddHealth: boolean = health % 2 === 1;

        const heart: Image = game.assets.get('treasures.fullHeart') as Image;

        let x: number = 176;
        const y: number = 48;
        const wholeHeartCount: number = Math.floor(health / 2);
        const heartCount: number = maxHealth / 2;

        game.drawString(104, 24, link.getRupeeCount());

        game.drawString(104, 48, link.getBombCount());

        for (let i: number = 0; i < wholeHeartCount; i++) {
            heart.draw(ctx, x, y);
            x += 8;
        }
        let drawnHeartCount: number = wholeHeartCount;
        if (health % 2 === 1) {
            const halfHeart: Image = game.assets.get('treasures.halfHeart') as Image;
            halfHeart.draw(ctx, x, y);
            x += 8;
            drawnHeartCount++;
        }

        const emptyHeart: Image = game.assets.get('treasures.emptyHeart') as Image;
        while (drawnHeartCount < heartCount) {
            emptyHeart.draw(ctx, x, y);
            x += 8;
            drawnHeartCount++;
        }

        this.paintMap(ctx);
    }

    private paintMap(ctx: CanvasRenderingContext2D) {

        ctx.fillStyle = '#83d313';
        const s: number = 3;

        // Note that the map isn't a perfect grid; there is a 1-pixel area
        // on the left and bottom of the gray area that is never highlighted
        // as a screen Link is on.  We could fix that, but this ia a faithful
        // reproduction
        const x: number = 17 + game.map.currentScreenCol * (s + 1);
        const y: number = 24 + game.map.currentScreenRow * (s + 1);

        ctx.fillRect(x, y, s, s);
    }
}
