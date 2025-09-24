import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Link } from './Link';
import { Projectile } from './Projectile';
import { SpriteSheet } from 'gtp';
import { ZeldaGame } from './ZeldaGame';
import { Octorok } from '@/enemy/Octorok';

const mockDrawByIndex = vi.fn();

describe('Projectile', () => {
    let game: ZeldaGame;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('enemies', { drawByIndex: mockDrawByIndex } as unknown as SpriteSheet);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    it('initializes with correct position and direction', () => {
        const p = new Projectile(game, 2, 3, 10, 20, 'UP');
        expect(p.x).toEqual(10);
        expect(p.y).toEqual(20);
        expect(p.dir).toEqual('UP');
    });

    describe('collidedWith()', () => {
        it('returns true and sets done if colliding with Link', () => {
            const p = new Projectile(game, 0, 0, 0, 0, 'DOWN');
            const link = new Link(game);
            expect(p.collidedWith(link)).toEqual(true);
            expect(p.done).toEqual(true);
        });

        it('returns false if colliding with non-Link', () => {
            const p = new Projectile(game, 0, 0, 0, 0, 'DOWN');
            expect(p.collidedWith(new Octorok(game))).toEqual(false);
            expect(p.done).toEqual(false);
        });
    });

    describe('getDamage() and setDamage()', () => {
        it('getDamage returns default and setDamage updates value', () => {
            const p = new Projectile(game, 0, 0, 0, 0, 'LEFT');
            expect(p.getDamage()).toEqual(1);
            p.setDamage(5);
            expect(p.getDamage()).toEqual(5);
        });
    });

    describe('paint()', () => {
        it('draws the projectile at correct index', () => {
            const p = new Projectile(game, 1, 2, 5, 6, 'LEFT');
            const ctx = game.getRenderingContext();
            p.paint(ctx);
            expect(mockDrawByIndex).toHaveBeenCalledWith(ctx, 5, 6, 32);
        });
    });

    describe('update()', () => {
        it('moves projectile DOWN and sets done if out of bounds', () => {
            const p = new Projectile(game, 0, 0, 0, 100, 'DOWN');
            p.h = 8;
            for (let i = 0; i < 100; i++) {
                p.update();
                if (p.done) break;
            }
            expect(p.done).toEqual(true);
        });

        it('moves projectile UP and sets done if out of bounds', () => {
            const p = new Projectile(game, 0, 0, 0, 0, 'UP');
            p.h = 8;
            p.update();
            expect(p.y).toBeLessThan(0);
            if (p.y < -p.h) expect(p.done).toEqual(true);
        });

        it('moves projectile LEFT and sets done if out of bounds', () => {
            const p = new Projectile(game, 0, 0, 0, 0, 'LEFT');
            p.w = 8;
            p.update();
            expect(p.x).toBeLessThan(0);
            if (p.x < -p.w) expect(p.done).toEqual(true);
        });

        it('moves projectile RIGHT and sets done if out of bounds', () => {
            const p = new Projectile(game, 0, 0, 300, 0, 'RIGHT');
            p.w = 8;
            for (let i = 0; i < 100; i++) {
                p.update();
                if (p.done) break;
            }
            expect(p.done).toEqual(true);
        });

        it('sets hitBox correctly', () => {
            const p = new Projectile(game, 0, 0, 10, 20, 'DOWN');
            p.w = 16;
            p.h = 16;
            const setSpy = vi.spyOn(p.hitBox, 'set');
            p.update();
            expect(setSpy).toHaveBeenCalledWith(p.x + 4, p.y + 3, 8, 10);
        });
    });
});
