import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Rupee, RupeeDenomination } from './Rupee';
import { ZeldaGame } from '@/ZeldaGame';
import { Link } from '@/Link';
import { Image } from 'gtp';
import { Octorok } from '@/enemy/Octorok';

const mockImageDraw = vi.fn();
const mockImage = {
    draw: mockImageDraw,
} as unknown as Image;

describe('Rupee', () => {
    let game: ZeldaGame;
    let rupee: Rupee;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('treasures.yellowRupee', mockImage);
        game.assets.set('treasures.blueRupee', mockImage);
        game.assets.set('treasures.redRupee', mockImage);
        game.link = new Link(game);
        rupee = new Rupee(game, 10, 20, 'blue');
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('initializes with correct position and color', () => {
            expect(rupee.x).toEqual(10);
            expect(rupee.y).toEqual(20);
            expect(rupee.getRupeeCount()).toEqual(5);
        });
    });

    describe('collidedWith()', () => {
        it('returns true if collided with Link', () => {
            expect(rupee.collidedWith(game.link)).toEqual(true);
        });

        const rupeeDenominations: RupeeDenomination[] = [ 'yellow', 'blue', 'red' ];
        rupeeDenominations.forEach((color) => {
            it("increments Link's rupee count if collided with Link", () => {
                rupee = new Rupee(game, 10, 10, color);
                const origRupeeCount = game.link.getRupeeCount();
                rupee.collidedWith(game.link);
                expect(game.link.getRupeeCount()).toEqual(origRupeeCount + rupee.getRupeeCount());
            });
        });

        it('returns false if collided with non-Link actor', () => {
            const octorok = new Octorok(game);
            expect(rupee.collidedWith(octorok)).toEqual(false);
        });
    });

    describe('paint()', () => {
        it('draws the rupee sprite', () => {
            const ctx = game.getRenderingContext();
            rupee.paint(ctx);
            expect(mockImageDraw).toHaveBeenCalledExactlyOnceWith(ctx, rupee.x, rupee.y);
        });
    });

    describe('update()', () => {
        it('does not throw when called', () => {
            expect(() => {
                rupee.update();
            }).not.toThrow();
        });
    });
});
