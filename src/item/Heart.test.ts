import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Heart } from './Heart';
import { ZeldaGame } from '@/ZeldaGame';
import { Link } from '@/Link';
import { Image } from 'gtp';
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
        it('in the first half of a play second, draws the red heart sprite', () => {
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(100);
            const ctx = game.getRenderingContext();
            heart.paint(ctx);
            expect(mockFullImageDraw).toHaveBeenCalled();
        });

        it('in the second half of a play second, draws the blue heart sprite', () => {
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(600);
            const ctx = game.getRenderingContext();
            heart.paint(ctx);
            expect(mockBlueImageDraw).toHaveBeenCalled();
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
