import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { Rectangle } from 'gtp';
import { Octorok } from './enemy/Octorok';
import { ShopItem } from './ShopItem';
import { TILE_HEIGHT } from '@/Constants';
import { ZeldaGame } from '@/ZeldaGame';

const mockImage = {
    draw: vi.fn(),
    height: 16,
    width: 16,
};

describe('ShopItem', () => {
    let game: ZeldaGame;
    let drawStringSpy: MockInstance<ZeldaGame['drawString']>;

    beforeEach(() => {
        game = new ZeldaGame();
        drawStringSpy = vi.spyOn(game, 'drawString').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('constructor()', () => {
        it('initializes x, y and a hitBox based on the image', () => {
            game.assets.set('treasures.blueHeart', mockImage);
            const item = ShopItem.create(game, 'heart', 50, 5, 6);
            expect(item.x).toEqual(5);
            expect(item.y).toEqual(6 + TILE_HEIGHT - item.h);
            expect(item.hitBox).toBeInstanceOf(Rectangle);
            expect(item.isPartOfInteraction).toEqual(true);
        });
    });

    describe('collidedWith()', () => {
        it('always returns false', () => {
            game.assets.set('treasures.blueHeart', mockImage);
            const item = ShopItem.create(game, 'heart', 10, 0, 0);
            expect(item.collidedWith(new Octorok(game))).toEqual(false);
        });
    });

    describe('paint()', () => {
        it('draws the item image and draws price with small offset for price <= 100', () => {
            game.assets.set('treasures.blueHeart', mockImage);
            const item = ShopItem.create(game, 'heart', 50, 20, 30);
            const ctx = game.getRenderingContext();
            item.paint(ctx);
            expect(mockImage.draw).toHaveBeenCalledExactlyOnceWith(ctx, item.x, item.y);
            const expectedX = item.x - 4;
            const expectedY = item.y + item.h + TILE_HEIGHT * 0.5;
            expect(drawStringSpy).toHaveBeenCalledExactlyOnceWith(expectedX, expectedY, 50, ctx);
        });

        it('draws the price with larger offset when price > 100', () => {
            game.assets.set('treasures.blueHeart', mockImage);
            const item = ShopItem.create(game, 'heart', 150, 40, 50);
            const ctx = game.getRenderingContext();
            item.paint(ctx);
            const expectedX = item.x - 10;
            const expectedY = item.y + item.h + TILE_HEIGHT * 0.5;
            expect(drawStringSpy).toHaveBeenCalledExactlyOnceWith(expectedX, expectedY, 150, ctx);
        });
    });

    describe('update()', () => {
        it('does not throw', () => {
            game.assets.set('treasures.blueHeart', mockImage);
            const item = ShopItem.create(game, 'heart', 20, 0, 0);
            expect(() => {
                item.update();
            }).not.toThrowError();
        });
    });
});
