import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Link } from '@/Link';
import { Screen } from '@/Screen';
import { ZeldaGame } from '@/ZeldaGame';
import { Tektite } from './Tektite';
import { SpriteSheet } from 'gtp';

const mockDrawByIndex = vi.fn();
const mockSpriteSheet = {
    drawByIndex: mockDrawByIndex,
} as unknown as SpriteSheet;

describe('Tektite', () => {
    let game: ZeldaGame;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('enemies', mockSpriteSheet);
        game.link = new Link(game);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('constructor()', () => {
        it('initializes a red Tektite with correct defaults', () => {
            const tektite = new Tektite(game, 'red');
            expect(tektite.strength).toEqual('red');
        });

        it('initializes a blue Tektite with correct defaults', () => {
            const tektite = new Tektite(game, 'blue');
            expect(tektite.strength).toEqual('blue');
        });
    });

    describe('paint()', () => {
        it('does not throw', () => {
            const tektite = new Tektite(game);
            const ctx = game.getRenderingContext();
            expect(() => {
                tektite.paint(ctx);
            }).not.toThrowError();
        });
    });

    describe('setLocationToSpawnPoint()', () => {
        it('sets location to a walkable point', () => {
            const tektite = new Tektite(game);
            const screen = new Screen(game.map);
            const isWalkableSpy = vi.spyOn(screen, 'isWalkable')
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true);
            tektite.setLocationToSpawnPoint(screen);
            expect(isWalkableSpy).toHaveBeenCalledTimes(2);
            expect(tektite.x % 16).toEqual(0);
            expect(tektite.y % 16).toEqual(0);
        });
    });

    describe('update()', () => {
        it('stays in the same position while paused', () => {
            const tektite = new Tektite(game);
            const origX = tektite.x;
            const origY = tektite.y;
            tektite.update();
            expect(tektite.x).toEqual(origX);
            expect(tektite.y).toEqual(origY);
        });

        it('moves after 61 frames', () => {
            const tektite = new Tektite(game);
            tektite.setLocation(100, 100);
            const origX = tektite.x;
            const origY = tektite.y;
            for (let i = 0; i < 61; i++) {
                tektite.update();
            }
            expect(tektite.x).not.toEqual(origX);
            expect(tektite.y).not.toEqual(origY);
        });
    });
});
