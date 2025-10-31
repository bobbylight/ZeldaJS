import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SpriteSheet } from 'gtp';
import { Lynel } from './Lynel';
import { Link } from '@/Link';
import { ZeldaGame } from '@/ZeldaGame';
import { Map } from '@/Map';

const mockDrawByIndex = vi.fn();
const mockSpriteSheet = {
    drawByIndex: mockDrawByIndex,
} as unknown as SpriteSheet;

describe('Lynel', () => {
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
        it('initializes a red Lynel with correct defaults', () => {
            const lynel = new Lynel(game, 'red');
            expect(lynel.strength).toEqual('red');
            expect(lynel.enemyName).toEqual('redLynel');
        });

        it('initializes a blue Lynel with correct defaults', () => {
            const lynel = new Lynel(game, 'blue');
            expect(lynel.strength).toEqual('blue');
            expect(lynel.enemyName).toEqual('blueLynel');
        });
    });

    describe('paint()', () => {
        it('does not throw', () => {
            const lynel = new Lynel(game);
            const ctx = game.getRenderingContext();
            expect(() => {
                lynel.paint(ctx);
            }).not.toThrowError();
        });
    });

    describe('setLocationToSpawnPoint()', () => {
        it('sets location to a walkable point', () => {
            const lynel = new Lynel(game);
            const screen = game.map.currentScreen;
            const isWalkableSpy = vi.spyOn(screen, 'isWalkable')
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true);
            lynel.setLocationToSpawnPoint(screen);
            expect(isWalkableSpy).toHaveBeenCalledTimes(2);
            expect(lynel.x % 16).toEqual(0);
            expect(lynel.y % 16).toEqual(0);
        });
    });

    describe('update()', () => {
        it('does not throw when a projectile is being spawned', () => {
            vi.spyOn(game, 'randomInt').mockReturnValue(0);
            const lynel = new Lynel(game);
            expect(() => {
                lynel.update();
            }).not.toThrowError();
        });

        it('does not throw when a projectile is not being spawned', () => {
            vi.spyOn(game, 'randomInt').mockReturnValue(1);
            const lynel = new Lynel(game);
            expect(() => {
                lynel.update();
            }).not.toThrowError();
        });
    });
});
