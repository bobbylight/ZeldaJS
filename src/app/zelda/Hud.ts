import {ZeldaGame} from './ZeldaGame';
import Image from 'gtp/lib/gtp/Image';
import {Link} from './Link';

declare let game: ZeldaGame;

export class Hud {

    render(ctx: CanvasRenderingContext2D) {

        const hudMockup: Image = <Image>game.assets.get('hud');
        hudMockup.draw(ctx, 0, 0);

        const link: Link = game.link;
        const health: number = link.getHealth();
        const maxHealth: number = link.getMaxHealth();
        const oddHealth: boolean = health % 2 === 1;

        const heart: Image = game.assets.get('treasures.fullHeart') as Image;

        let x: number = 176;
        let y: number = 48;
        const wholeHeartCount: number = Math.floor(health / 2);
        const heartCount: number = maxHealth / 2;

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
    }
}