import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SpriteSheet } from 'gtp';
import { Moblin } from './Moblin';
import { Link } from '@/Link';
import { ZeldaGame } from '@/ZeldaGame';
import { Map } from '@/Map';

const mockDrawByIndex = vi.fn();
const mockSpriteSheet = {
    drawByIndex: mockDrawByIndex,
} as unknown as SpriteSheet;

describe('Moblin', () => {
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
        it('initializes a red Moblin with correct defaults', () => {
            const moblin = new Moblin(game, 'red');
            expect(moblin.strength).toEqual('red');
            expect(moblin.enemyName).toEqual('redMoblin');
        });

        it('initializes a blue Moblin with correct defaults', () => {
            const moblin = new Moblin(game, 'blue');
            expect(moblin.strength).toEqual('blue');
            expect(moblin.enemyName).toEqual('blueMoblin');
        });
    });

    describe('paint()', () => {
        it('does not throw', () => {
            const moblin = new Moblin(game);
            const ctx = game.getRenderingContext();
            expect(() => {
                moblin.paint(ctx);
            }).not.toThrowError();
        });
    });

    describe('setLocationToSpawnPoint()', () => {
        it('sets location to a walkable point', () => {
            const moblin = new Moblin(game);
            const screen = game.map.currentScreen;
            const isWalkableSpy = vi.spyOn(screen, 'isWalkable')
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true);
            moblin.setLocationToSpawnPoint(screen);
            expect(isWalkableSpy).toHaveBeenCalledTimes(2);
            expect(moblin.x % 16).toEqual(0);
            expect(moblin.y % 16).toEqual(0);
        });
    });

    describe('update()', () => {
        it('does not throw when a projectile is being spawned', () => {
            vi.spyOn(game, 'randomInt').mockReturnValue(0);
            const moblin = new Moblin(game);
            expect(() => {
                moblin.update();
            }).not.toThrowError();
        });

        it('does not throw when a projectile is not being spawned', () => {
            vi.spyOn(game, 'randomInt').mockReturnValue(1);
            const moblin = new Moblin(game);
            expect(() => {
                moblin.update();
            }).not.toThrowError();
        });
    })
});
