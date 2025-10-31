import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { AssetLoader, Image } from 'gtp';
import { Rupee } from './Rupee';
import { ZeldaGame } from '@/ZeldaGame';
import { Link } from '@/Link';
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
        rupee = new Rupee(game, 10, 20, 'yellow');
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
            expect(rupee.getRupeeCount()).toEqual(1);
        });
    });

    describe('collidedWith()', () => {
        it('returns true if collided with Link', () => {
            expect(rupee.collidedWith(game.link)).toEqual(true);
        });

        it("increments Link's rupee count if collided with Link", () => {
            rupee = new Rupee(game, 10, 10, 'yellow');
            const origRupeeCount = game.link.getRupeeCount();
            rupee.collidedWith(game.link);
            expect(game.link.getRupeeCount()).toEqual(origRupeeCount + rupee.getRupeeCount());
        });

        it('returns false if collided with non-Link actor', () => {
            const octorok = new Octorok(game);
            expect(rupee.collidedWith(octorok)).toEqual(false);
        });
    });

    describe('paint()', () => {
        let ctx: CanvasRenderingContext2D;
        let getSpy: MockInstance<AssetLoader['get']>;

        beforeEach(() => {
            ctx = game.getRenderingContext();
            getSpy = vi.spyOn(game.assets, 'get');
        });

        it('blinks when first rendered', () => {
            for (let i = 0; i < 3; i++) {
                rupee.update();
                rupee.paint(ctx);
            }
            expect(mockImageDraw).toHaveBeenCalledTimes(3);

            // Not rendered the 4th frame
            rupee.update();
            rupee.paint(ctx);
            expect(mockImageDraw).toHaveBeenCalledTimes(3);
        });

        describe('for the blue rupee', () => {
            beforeEach(() => {
                rupee = new Rupee(game, 10, 20, 'blue');
            });

            it('after blinking, draws the rupee sprite', () => {
                for (let i = 0; i < 75; i++) {
                    rupee.update();
                }
                rupee.paint(ctx);
                expect(mockImageDraw).toHaveBeenCalledExactlyOnceWith(ctx, rupee.x, rupee.y);
            });
        });

        describe('for the yellow rupee', () => {
            it('after blinking, draws the blue rupee first', () => {
                for (let i = 0; i < 75; i++) {
                    rupee.update();
                }
                rupee.paint(ctx);
                expect(getSpy).toHaveBeenCalledExactlyOnceWith('treasures.blueRupee');
                expect(mockImageDraw).toHaveBeenCalledExactlyOnceWith(ctx, rupee.x, rupee.y);
            });

            it('after blinking, draws the yellow rupee second', () => {
                for (let i = 0; i < 75 + 8; i++) {
                    rupee.update();
                }
                rupee.paint(ctx);
                expect(getSpy).not.toHaveBeenCalledOnce();
                expect(mockImageDraw).toHaveBeenCalledExactlyOnceWith(ctx, rupee.x, rupee.y);
            });
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
