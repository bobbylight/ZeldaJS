import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Image } from 'gtp';
import { Hud } from './Hud';
import { Link } from './Link';
import { Map } from './Map';
import { ZeldaGame } from './ZeldaGame';

const mockImage = {
    draw: vi.fn(),
};

const mockMap = {
    currentScreenCol: 0,
    currentScreenRow: 0,
};

describe('Hud', () => {
    let game: ZeldaGame;
    let hud: Hud;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('hud', mockImage as unknown as Image);
        game.assets.set('treasures.fullHeart', mockImage as unknown as Image);
        game.assets.set('treasures.halfHeart', mockImage as unknown as Image);
        game.assets.set('treasures.emptyHeart', mockImage as unknown as Image);
        game.assets.set('treasures.bomb', mockImage as unknown as Image);
        game.link = new Link(game);
        game.link.incHealth(-3); // Remove 1.5 hearts for coverage
        game.map = mockMap as unknown as Map;
        game.drawString = vi.fn();
        hud = new Hud(game);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('render()', () => {
        it('calls drawing methods when visible', () => {
            const ctx = game.getRenderingContext();
            const fillRectSpy = vi.spyOn(ctx, 'fillRect');
            hud.render(ctx);
            expect(fillRectSpy).toHaveBeenCalled();
            expect(mockImage.draw).toHaveBeenCalledTimes(5);
        });
    });
});
