import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Link } from '@/Link';
import { Octorok } from './Octorok';
import { ZeldaGame } from '@/ZeldaGame';
import { SpriteSheet } from 'gtp';
import { Map } from '@/Map';

const mockDrawByIndex = vi.fn();
const mockSpriteSheet = {
    drawByIndex: mockDrawByIndex,
} as unknown as SpriteSheet;

describe('Octorok', () => {
    let game: ZeldaGame;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('enemies', mockSpriteSheet);
        game.assets.set('overworld', mockSpriteSheet)
        game.map = new Map(game, 'overworld', 2, 2);
        game.link = new Link(game);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('constructor()', () => {
        it('initializes a red Octorok with correct defaults', () => {
            const octorok = new Octorok(game, 'red');
            expect(octorok.strength).toEqual('red');
            expect(octorok.enemyName).toEqual('redOctorok');
        });

        it('initializes a blue Octorok with correct defaults', () => {
            const octorok = new Octorok(game, 'blue');
            expect(octorok.strength).toEqual('blue');
            expect(octorok.enemyName).toEqual('blueOctorok');
        });
    });

    describe('paint()', () => {
        it('does not throw', () => {
            const octorok = new Octorok(game);
            const ctx = game.getRenderingContext();
            expect(() => {
                octorok.paint(ctx);
            }).not.toThrowError();
        });
    });

    describe('setLocationToSpawnPoint()', () => {
        it('sets location to a walkable point', () => {
            const octorok = new Octorok(game);
            const screen = game.map.currentScreen;
            const isWalkableSpy = vi.spyOn(screen, 'isWalkable')
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true);
            octorok.setLocationToSpawnPoint(screen);
            expect(isWalkableSpy).toHaveBeenCalledTimes(2);
            expect(octorok.x % 16).toEqual(0);
            expect(octorok.y % 16).toEqual(0);
        });
    });

    describe('update()', () => {
        it('does not throw when a projectile is being spawned', () => {
            vi.spyOn(game, 'randomInt').mockReturnValue(0);
            const octorok = new Octorok(game);
            expect(() => {
                octorok.update();
            }).not.toThrowError();
        });

        it('does not throw when a projectile is not being spawned', () => {
            vi.spyOn(game, 'randomInt').mockReturnValue(1);
            const octorok = new Octorok(game);
            expect(() => {
                octorok.update();
            }).not.toThrowError();
        });
    })
});
