import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Sword } from './Sword';
import { Link } from './Link';
import { Map } from './Map';
import { ZeldaGame } from './ZeldaGame';
import { Octorok } from '@/enemy/Octorok';

const mockDrawByIndex = vi.fn();
const mockSpriteSheet = {
    drawByIndex: mockDrawByIndex,
};

const screen = {
    addActor: vi.fn(),
    removeLinksSwordActor: vi.fn(),
};

const mockMap = {
    currentScreen: screen,
};

describe('Sword', () => {
    let game: ZeldaGame;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('link', mockSpriteSheet);
        game.link = new Link(game);
        game.link.w = 16;
        game.link.h = 16;
        game.map = mockMap as unknown as Map;
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    it('initializes position for DOWN', () => {
        game.link.dir = 'DOWN';
        game.link.x = 5;
        game.link.y = 7;
        const sword = new Sword(game);
        expect(sword.x).toBe(game.link.x);
        expect(sword.y).toBe(game.link.y + 12);
    });

    it('initializes position for LEFT', () => {
        game.link.dir = 'LEFT';
        game.link.x = 10;
        game.link.y = 15;
        const sword = new Sword(game);
        expect(sword.x).toBe(game.link.x - 10);
        expect(sword.y).toBe(game.link.y);
    });

    it('initializes position for UP', () => {
        game.link.dir = 'UP';
        game.link.x = 8;
        game.link.y = 12;
        const sword = new Sword(game);
        expect(sword.x).toBe(game.link.x);
        expect(sword.y).toBe(game.link.y - 12);
    });

    it('initializes position for RIGHT', () => {
        game.link.dir = 'RIGHT';
        game.link.x = 20;
        game.link.y = 30;
        const sword = new Sword(game);
        expect(sword.x).toBe(game.link.x + 10);
        expect(sword.y).toBe(game.link.y);
    });

    it('collidedWith always returns false', () => {
        const sword = new Sword(game);
        expect(sword.collidedWith(new Octorok(game))).toBe(false);
    });

    describe('paint()', () => {
        let ctx: CanvasRenderingContext2D;

        beforeEach(() => {
            ctx = game.getRenderingContext();
        });

        describe('when Link is facing DOWN', () => {
            beforeEach(() => {
                game.link.dir = 'DOWN';
            });

            it('is only rendered for the last 14 frames', () => {
                const sword = new Sword(game);

                for (let i = 0; i < 16; i++) {
                    sword.update();
                    sword.paint(ctx);
                }

                expect(mockDrawByIndex).toHaveBeenCalledTimes(14);
            });
        });

        describe('when Link is facing RIGHT', () => {
            beforeEach(() => {
                game.link.dir = 'RIGHT';
            });

            it('is only rendered for the last 14 frames', () => {
                const sword = new Sword(game);

                for (let i = 0; i < 16; i++) {
                    sword.update();
                    sword.paint(ctx);
                }

                expect(mockDrawByIndex).toHaveBeenCalledTimes(14);
            });
        });
    });
});
