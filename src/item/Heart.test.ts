import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { Heart } from './Heart';
import { ZeldaGame } from '@/ZeldaGame';
import { Link } from '@/Link';
import { AssetLoader, Image } from 'gtp';
import { TILE_HEIGHT } from '@/Constants';
import { Octorok } from '@/enemy/Octorok';

const mockFullImageDraw = vi.fn();
const mockFullImage = {
    draw: mockFullImageDraw,
} as unknown as Image;

const mockBlueImageDraw = vi.fn();
const mockBlueImage = {
    draw: mockBlueImageDraw,
} as unknown as Image;

describe('Heart', () => {
    let game: ZeldaGame;
    let heart: Heart;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('treasures.fullHeart', mockFullImage);
        game.assets.set('treasures.blueHeart', mockBlueImage);
        game.link = new Link(game);
        heart = new Heart(game, 12, 34);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('initializes with correct position', () => {
            expect(heart.x).toEqual(12);
            expect(heart.y).toEqual(34);
            expect(heart.w).toEqual(8);
            expect(heart.h).toEqual(TILE_HEIGHT);
        });
    });

    describe('collidedWith()', () => {
        it('returns true if collided with Link', () => {
            expect(heart.collidedWith(game.link)).toEqual(true);
        });

        it("increments Link's health when colliding with him", () => {
            const incHealthSpy = vi.spyOn(game.link, 'incHealth');
            heart.collidedWith(game.link);
            expect(incHealthSpy).toHaveBeenCalledOnce();
        });

        it('returns false if collided with non-Link actor', () => {
            const octorok = new Octorok(game);
            expect(heart.collidedWith(octorok)).toEqual(false);
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
                heart.update();
                heart.paint(ctx);
            }
            expect(getSpy).toHaveBeenCalledTimes(3);

            // Not rendered the 4th frame
            heart.update();
            heart.paint(ctx);
            expect(getSpy).toHaveBeenCalledTimes(3);
        });

        it('after blinking, draws the red heart sprite first', () => {
            for (let i = 0; i < 75; i++) {
                heart.update();
            }
            heart.paint(ctx);
            expect(getSpy).toHaveBeenCalledExactlyOnceWith('treasures.fullHeart');
        });

        it('after blinking, draws the blue heart sprite second', () => {
            for (let i = 0; i < 75 + 8; i++) {
                heart.update();
            }
            heart.paint(ctx);
            expect(getSpy).toHaveBeenCalledExactlyOnceWith('treasures.blueHeart');
        });
    });

    describe('update()', () => {
        it('does not throw when called', () => {
            expect(() => {
                heart.update();
            }).not.toThrow();
        });
    });
});
