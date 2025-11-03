import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Rectangle } from 'gtp';
import { Fire } from './Fire';
import { Octorok } from './enemy/Octorok';
import { ZeldaGame } from './ZeldaGame';
import { Actor } from './Actor';

const mockFire1Image = {
    draw: vi.fn(),
};

const mockFire2Image = {
    draw: vi.fn(),
};

describe('Fire', () => {
    let game: ZeldaGame;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('npcs.fire1', mockFire1Image);
        game.assets.set('npcs.fire2', mockFire2Image);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('constructor()', () => {
        it('initializes x, y and hitBox', () => {
            const f = new Fire(game, 10, 20);
            expect(f.x).toEqual(10);
            expect(f.y).toEqual(20);
            expect(f.hitBox).toEqual(new Rectangle(10, 20, 16, 16));
        });
    });

    describe('collidedWith()', () => {
        it('always returns false', () => {
            const f = new Fire(game, 0, 0);
            expect(f.collidedWith(new Octorok(game))).toEqual(false);
        });
    });

    describe('paint()', () => {
        it('draws the fire2 image when frameCount is low and paints hitbox', () => {
            const spyPaintHitBox = vi.spyOn(Actor.prototype, 'possiblyPaintHitBox').mockImplementation(() => {});
            const f = new Fire(game, 5, 6);
            const ctx = game.getRenderingContext();
            f.paint(ctx);
            expect(mockFire2Image.draw).toHaveBeenCalledExactlyOnceWith(ctx, f.x, f.y);
            expect(spyPaintHitBox).toHaveBeenCalledOnce();
        });

        it('draws the fire1 image after enough updates (frameCount > 6)', () => {
            const spyPaintHitBox = vi.spyOn(Actor.prototype, 'possiblyPaintHitBox').mockImplementation(() => {});
            const f = new Fire(game, 7, 8);
            // advance frameCount to 7
            for (let i = 0; i < 7; i++) {
                f.update();
            }
            const ctx = game.getRenderingContext();
            f.paint(ctx);
            expect(mockFire1Image.draw).toHaveBeenCalledExactlyOnceWith(ctx, f.x, f.y);
            expect(spyPaintHitBox).toHaveBeenCalledOnce();
        });
    });

    describe('update()', () => {
        it('advances frames and wraps after 12 updates (affects which image is drawn)', () => {
            const f = new Fire(game, 1, 2);
            const ctx = game.getRenderingContext();
            // advance to fire1 (frameCount = 7)
            for (let i = 0; i < 7; i++) {
                f.update();
            }
            f.paint(ctx);
            expect(mockFire1Image.draw).toHaveBeenCalledOnce();

            // advance 5 more to complete 12 and wrap to 0 -> fire2
            for (let i = 0; i < 5; i++) {
                f.update();
            }
            f.paint(ctx);
            expect(mockFire2Image.draw).toHaveBeenCalledOnce();
        });
    });
});
