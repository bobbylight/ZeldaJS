import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Actor } from './Actor';
import { Npc } from './Npc';
import { Octorok } from './enemy/Octorok';
import { ZeldaGame } from './ZeldaGame';

const mockImage = {
    draw: vi.fn(),
};

describe('Npc', () => {
    let game: ZeldaGame;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('npcs.merchant', mockImage);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('constructor()', () => {
        it('initializes properly', () => {
            const npc = new Npc(game, 'merchant', 10, 20);
            expect(npc.x).toEqual(10);
            expect(npc.y).toEqual(20);
            expect(npc.hitBox).toBeDefined();
        });
    });

    describe('collidedWith()', () => {
        it('always returns false', () => {
            const npc = new Npc(game, 'merchant', 5, 6);
            expect(npc.collidedWith(new Octorok(game))).toEqual(false);
        });
    });

    describe('paint()', () => {
        it('draws the npc image and calls possiblyPaintHitBox()', () => {
            const spyPaintHitBox = vi.spyOn(Actor.prototype, 'possiblyPaintHitBox').mockImplementation(() => {});
            const npc = new Npc(game, 'merchant', 12, 34);
            const ctx = game.getRenderingContext();
            npc.paint(ctx);
            expect(mockImage.draw).toHaveBeenCalledOnce();
            expect(spyPaintHitBox).toHaveBeenCalledOnce();
        });
    });

    describe('update()', () => {
        it('does not throw', () => {
            const npc = new Npc(game, 'merchant', 0, 0);
            expect(() => {
                npc.update();
            }).not.toThrowError();
        });
    });
});
